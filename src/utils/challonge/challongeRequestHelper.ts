type ChallongeRequest = {
    path: string,
    body_content?: object,
    method?: string | null,
    authorization: string,
    authorization_version: string
}

type ChallongeAuthResponseBody = {
	access_token: string,    
	expires_in: number,
	refresh_token: string,
	token_type?: string,
	scope?: string,
	created_at?: number
}

type ChallongeResBody = {
	access_token: string,
	expires_in: number,
	refresh_token: string,
	token_type?: string,
	scope?: string,
	created_at?: number
}


//Change authcode for token
export async function ChallongeAuthRequestHelper(body: ChallongeRequest)  {}

export async function ChallongeRequestHelper(body: ChallongeRequest)  {
    try{
        let req : object = {};
        
        //Get Method
       if(body.method === null){
        req = {
            method: 'GET',  
         }
       }else{
           req = {
            method: body.method,
            body: JSON.stringify(body.body_content)            
           }
       }

        //Reach out for token exchahnge
        const makeRequest = await fetch(body.path, { ...req, headers: {
                "Authorization": body.authorization,
                "Accept": 'application/json',
                "Authorization-Type": body.authorization_version,
                "Content-Type": "application/vnd.api+json",
            }, })

            const response : ChallongeResBody = await makeRequest.json();
            return response;
       
    }catch(e){
       throw new Error(e)
    }
}