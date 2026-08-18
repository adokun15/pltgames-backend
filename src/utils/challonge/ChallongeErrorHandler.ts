import ChallongeAPIError from "../exceptions/ChallongeError";

export function handleChallongeResponse<T>(res: T | any[]): T {
  try {
    //Narrow Error and output error to client
    if (Array.isArray(res) && res[0]?.detail) {
      throw new ChallongeAPIError(
        res.length > 0
          ? res.map((e) => e.detail).join(" ")
          : "Challonge API error",
        Number(res[0]?.status) || 500,
        res,
      );
    }
    //Retunr { data }
    return res as T;
  } catch (e) {
    throw e;
  }
}
