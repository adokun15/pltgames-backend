import { ChallongeRequestHelper } from "@/utils/challonge/challongeRequestHelper"

//Change authcode for token
export async function ExchangeCodeForToken(code: string){
    try{
        //Reach out for token exchahnge
        const path = `
        https://api.challonge.com/oauth/token?
        code=${code}
        &client_id=${process.env.CHALLONGE_CLIENT_ID}&
        grant_type=authorization_code
        &redirect_uri=${process.env.CHALLONGE_CLIENT_REDIRECT_URI}
        `

        const req = await ChallongeRequestHelper({
            path,
            authorization: process.env.CHALLONGE_APPLICATION_TOKEN,
            authorization_version:'v1'
        })

        return req;
    }catch(e){
       
    }
}

//Check token validity
export function AuthorizeResourceService(){
    
    try{
   //https://api.challonge.com/oauth/token?refresh_token=c8d89cd276476b7ca20924d5a45265ca99a0c4ab1b07a78d93bb8b8150575403&client_id=2c23d0364e9c1a0228c2f15a0cac41a7952c565e24853142f3a18b1ec5ae4f35&grant_type=refresh_token&redirect_uri=https%3A%2F%2Fpltgames.xyz%2Fapi%2Fauth%2Fcallback
    }catch(e){

    }
}

export function RefreshAccesTokenService(){
    try{
   // https://api.challonge.com/oauth/token?refresh_token=c8d89cd276476b7ca20924d5a45265ca99a0c4ab1b07a78d93bb8b8150575403&client_id=2c23d0364e9c1a0228c2f15a0cac41a7952c565e24853142f3a18b1ec5ae4f35&grant_type=refresh_token&redirect_uri=https%3A%2F%2Fpltgames.xyz%2Fapi%2Fauth%2Fcallback
    }catch(e){

    }
}


