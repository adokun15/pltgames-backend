//Get user from db; update should
import { GetUserFromDb } from "./repositories/users.repository";

//Public: less data is released;
export async function GetSingleUserByUserNameService(username: string) {
  const user = await GetUserFromDb(username);
  return user;
}

//Authorize: more data is released;
export async function GetSingleUserByUserIdService(userId: string) {
  const user = await GetUserFromDb(userId);
  return user;
}
