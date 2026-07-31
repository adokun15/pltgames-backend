//Get user from db; update should 

import { GetUserFromDb } from "./repositories/users.repository";

//Public: less data is released;
export async function GetSingleUserByUserNameService(username:string) {
    try{
        const user = await GetUserFromDb(username);
        console.log(user)
        return user;
    }catch(e){
        console.log(e)
    }
}


//Authorize: more data is released;
export async function GetSingleUserByUserIdService(userId: string) {
    try{
        const user = await GetUserFromDb(userId);
        console.log(user)
        return user;
    }catch(e){
        console.log(e)
    }
}
