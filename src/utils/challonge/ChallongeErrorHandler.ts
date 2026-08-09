import ChallongeAPIError from "../exceptions/ChallongeError";

export function handleChallongeResponse<T>(res: T | any[]): T {
  //Narrow Error and output error to client
  if (Array.isArray(res) && res[0]?.detail) {
    const [err] = res;
    throw new ChallongeAPIError(
      err.detail || "Challonge API error",
      Number(err.status) || 500,
      res,
    );
  }

  //Retunr { data }
  return res as T;
}
