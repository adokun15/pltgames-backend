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
    error?: string,
    error_description?: string
}


//Change authcode for token
export async function ChallongeHelper(body: ChallongeRequest)  {
    //User, Match, participant and tournament
        let req : object = {};
        
        //Get Method
       if(body.method === null || body.method?.toUpperCase() === "GET"){
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
        const makeRequest = await fetch(`https://api.challonge.com${body.path}`, { ...req, headers: {
                "Authorization": body.authorization,
                "Accept": 'application/json',
                "Authorization-Type": body.authorization_version,
                "Content-Type": "application/vnd.api+json",
            }, })

            //Make Research on the 'unknown api result;
        const data = await makeRequest.json();   
        return data;
}

//User
export async function ChallongeUserRequestHelper(body: ChallongeRequest)  {
    try {
        const res = await ChallongeHelper(body);
        
        console.log(res)

        if(!res?.data){
            return {
                error: 'USER_NOT_FOUND',
                error_description : "This user does not exist found or token is invalid"
            }
        }
        const {
        	id: challonge_id,
		attributes: {
			email,
			username,
			image_url, 
		}
        } = res?.data;
       return {
        challonge_id, email, username, avatar: image_url
       } 
    }catch(e){
        console.log(e)
    }
}

export async function ChallongeAuthRequestHelper(body: ChallongeRequest)  {
    try{
        let req : object = {};
        
        //Get Method
       if(body.method === null || body.method?.toUpperCase() === "GET"){
        req = {
            method: 'GET',  
         }
       }else{
           req = {
            method: body.method,
        }
    }
    
    if(body.body_content) {
        req = {body: JSON.stringify(body.body_content)            
        }
    }

        //Reach out for token exchahnge
        const makeRequest = await fetch(`https://api.challonge.com${body.path}`, { ...req, headers: {
                "Authorization": body.authorization,
                "Accept": 'application/json',
                "Authorization-Type": body.authorization_version,
                "Content-Type": "application/vnd.api+json",
            }, })

            const response : ChallongeAuthResponseBody = await makeRequest.json();
            
            
            return response;
       

    }catch(e){
        console.log(e)
        console.log(e.message)
       throw new Error(e)
    }
}