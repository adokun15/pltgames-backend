import {
  AddUserToDb,
  GetUserFromDb,
  UpdateUserFromDb,
} from "@/users/repositories/users.repository";
import {
  ChallongeAuthRequestHelper,
  ChallongeUserRequestHelper,
} from "@/utils/challonge/challongeRequestHelper";
import jwt from "jsonwebtoken";
import { CreateSessionInDb } from "./repositories/sessions.repository";
import ChallongeAPIError from "@/utils/exceptions/ChallongeError";
import NotFoundError from "@/utils/exceptions/NotFound";

function getExpiry(seconds: number) {
  return new Date(Date.now() + seconds * 1000);
}

/*  Challonge Authorization Service*/
export async function ExchangeCodeForToken(code: string) {
  const tokenUrl = `/oauth/token?code=${code}&client_id=${process.env.CHALLONGE_CLIENT_ID}&grant_type=authorization_code&redirect_uri=${process.env.CHALLONGE_CLIENT_REDIRECT_URI}`;

  //retrieve code for new token; works
  const tokenRes = await ChallongeAuthRequestHelper({
    method: "POST",
    path: tokenUrl,
    authorization: process.env.CHALLONGE_APPLICATION_TOKEN,
    authorization_version: "v1",
  });

  //Catch error from challonge;
  if (tokenRes.error) {
    if ((tokenRes.error = "invalid_request")) {
      throw new ChallongeAPIError("Invalid or Expired Code!", 500);
    }
    throw new ChallongeAPIError(tokenRes.error_description, 500);
  }

  // Decode token to get user profile; limit this often;
  const user_path = `/me.json`;

  //Reach out to challonge.API to decode token;
  const user = await ChallongeUserRequestHelper({
    path: user_path,
    authorization: `Bearer ${tokenRes.access_token}`,
    authorization_version: "v2",
  });

  //  Save user info and newly created tokens
  await AddUserToDb({
    challonge_id: user.challonge_id,
    username: user.username,
    email: user.email,
    avatar: user?.avatar,
    access_token: tokenRes.access_token, //encrypt this later
    refresh_token: tokenRes.refresh_token, //encrypt this later
    expires_at: getExpiry(tokenRes.expires_in),
  });

  // Create local session JWT: prevent overuse of third-party token
  const refresh_token = "generate-random-token-here";

  const session = await CreateSessionInDb({
    challonge_id: user.challonge_id,
    refresh_token,
    expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), //7days
  });

  const accessToken = jwt.sign(
    {
      challonge_id: user.challonge_id,
    },
    process.env.JWT_SECRET!,
    { expiresIn: "15m" },
  );

  const data = {
    user,
    accessToken,
    sessionId: session?.sessionId,
  };

  return data;
}

export async function RefreshChallongeAccessTokenService(arg: {
  token: string;
}) {
  const url = `
    /oauth/token?refresh_token=${arg.token}&grant_type=refresh_token&client_id=${process.env.CHALLONGE_CLIENT_ID}&redirect_uri=${process.env.CHALLONGE_CLIENT_REDIRECT_URI}
    `;

  //Error: Refresh Token Expires / Invoked;

  //Request for new Access Token
  const res = await ChallongeAuthRequestHelper({
    method: "POST",
    path: url,
    authorization: process.env.CHALLONGE_APPLICATION_TOKEN,
    authorization_version: "v1",
  });

  console.log(res);
  return res;
}

//Check token validity: to `join/leave tournament, load profile, update participants`;
export async function AuthorizeChallongeResourceService(arg: {
  token: string;
}) {
  //Decode token and get user (refresh and access)
  const decoded = jwt.verify(arg.token, process.env.JWT_SECRET!) as {
    challonge_id: string;
  };

  //Get user & session immediately;
  const user = await GetUserFromDb(decoded.challonge_id);

  //This user don't have a challonge account;
  if (!user) throw new NotFoundError("User not found");

  //if there is still time, simply provide a decrypted token and user info;
  if (new Date(user.expires_at) > new Date()) {
    // return { user, token: decrypt(user.access_token)}
    return { user, token: user.access_token }; //Decrypt later
  }

  //This code is only reachable if expiry time is up!
  const newToken = await RefreshChallongeAccessTokenService({
    //Decrypt later Also
    token: user.refresh_token, // Get refresh token from users;
  });

  //Update with new token if available
  await UpdateUserFromDb(user.challonge_id, {
    access_token: newToken.access_token,
    refresh_token: newToken.refresh_token,
    expires_at: getExpiry(newToken.expires_in),
  });

  //Now send token back to user without asking them for login;
  return {
    access_token: newToken.access_token,
    user,
  };
}
