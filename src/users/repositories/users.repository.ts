//Direct access to the db

import pool from "@/utils/database";

//Get User From Database
export const GetUserFromDb = async (identifier: string) => {
    try {
 
        const query = {
  text: `select * from users 
         where username = $1 or challonge_id = $1;         
        `,
  values: [identifier],
}
 
        const res = await pool.query(query);
     
     if (!res.rows.length) {
      //throw new CustomError("Merchant not Found", 404);
      return {};
    }
    
    return res.rows[0];
} catch (e) {
    console.log(e);
    //throw new CustomError(e?.message);
}
};


export const AddUserToDb = async (arg: {
    challonge_id: string,
    username: string,
    email: string,
    access_token?: string,
    refresh_token?: string,
    expires_at?: Date,
    avatar?: string | null,
    role?: string | null, //Add enums later 
}) => {
    try {
      const query = {
  text: `INSERT INTO users
(challonge_id, username, email, avatar, role)
VALUES ($1, $2, $3, $4, $5)
ON CONFLICT (challonge_id) DO UPDATE
SET 
  username = COALESCE(EXCLUDED.username, users.username),
  avatar = COALESCE(EXCLUDED.avatar, users.avatar),
  email = COALESCE(EXCLUDED.email, users.email)
RETURNING challonge_id, username, role;
    `,
  values: [
    arg.challonge_id, 
    arg.username, 
    arg.email, 
    arg.avatar, 
    arg.role, 
],
} 
        const res = await pool.query(query);
     
     if (!res.rows.length) {
      //throw new CustomError("Merchant not Found", 404);
      return {};
    }
    
    console.log(res.rows[0])
    return  {user: res.rows[0]};
} catch (e) {
    console.log(e);
    //throw new CustomError(e?.message);
}
};


export const UpdateUserFromDb = async (identifier: string, data: {
    username?: string,
    email?: string,
    access_token?: string,
    refresh_token?: string,
    expires_at?: Date,
    avatar?: string | null,
    role?: string | null, //Add enums later 
}) => {
 
    try {
 
        /*
        let query_text = `
        UPDATE products
        SET ${setClause} 
        where id = $${q.length - 1}
        AND 
        store_id = $${q.length} 
        RETURNING id;         
        `;
    
        const query = {
  text: `
  INSERT INTO users
    (challonge_id, username, email, avatar, role)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id;      `,
  values: [
    arg.challonge_id, 
    arg.username, 
    arg.email, 
    arg.avatar, 
    arg.role, 
],
} 
        const res = await pool.query(query_text, [identifier]);
     
     if (!res.rows.length) {
      //throw new CustomError("Merchant not Found", 404);
      return {};
    }
    
    return res.rows[0];
*/
    } catch (e) {
    console.log(e);
    //throw new CustomError(e?.message);
}
};


export const DeleteUserFromDb = async (identifier: string) => {
    const pquery = await pool.connect();
    
    try {
    await pquery.query("BEGIN");
    
    const query_text = `DELETE FROM users WHERE challonge_id = $1 RETURNING username, id`;
    
    //sET TO FALSE TO PREVENT USER FROM CREATING A FREE TRIAL ACCOUNT ONCE FREE TRAIL IS REMOVED THEN WE CAN DELETE MERCHANT
   // const query_text_merchant = `UPDATE SET active = false WHERE merchants $1 RETURNING *`;
    
   //await pool.query(query_text_merchant, [id]);
    
    const deleted_info = await pool.query(query_text, [identifier]);
    
   await pquery.query("COMMIT");
    return deleted_info.rows[0];
} catch (e) {
    console.log(e)
    //await pquery.query("ROLLBACK");
    //throw DatabaseError(e);
}
};

/*export const CreateMerchantforDb = async (query) => {
  try {
    const query_text = ` 
  INSERT INTO users(phone, name, email)
  VALUES ($1, $2, $3)
  returning *;
`;

    const res = await pool.query(query_text, query);
    return res.rows[0];
  } catch (e) {
 //   console.log(e);
//    throw new CustomError(e?.message);
  }
};
export const UpdateMerchantFromDb = async ({ updates, merchant_id }) => {
    const { id, setClause, values } = ClauseExtractor({
        updates,
        id: merchant_id,
    });
    
    const allowedField = ["id", "email", "name", "phone"];

    const isAllowed = fields.some((field) =>
    allowedField.includes(field.toLowerCase()),
  );

  if (!isAllowed) {
    throw new CustomError("Invalid field!", 400);
}

try {
    const query_text = `      
    UPDATE merchants
    SET ${setClause}
    WHERE id = $${id} 
    returning *;
    `;
    const res = await pool.query(query_text, values);
    return res.rows[0];
} catch (e) {
    throw new CustomError(e);
}
};


//After 1 year & automatically delete
export const DeleteMerchantFromDb = async (id) => {
};
*/