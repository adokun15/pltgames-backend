//Direct access to the db

import pool from "@/utils/database";
import { DbUpdateHelper } from "@/utils/database/updateHelper";
import { handlePgError } from "@/utils/exceptions/DbError";
import ValidationError from "@/utils/exceptions/ValidationError";
import { DatabaseError } from "pg";

//Get User From Database
export const GetUserFromDb = async (identifier: string) => {
  try {
    const query = {
      text: `
         select * from users 
         where 
         username = $1 or challonge_id = $1
         limit 1;      
        `,
      values: [identifier],
    };

    const res = await pool.query(query);

    if (res.rows.length === 0) {
      throw new ValidationError(
        {
          user: "User not found",
        },
        "This User is not found",
      );
    }

    return res.rows[0] as {
      challonge_id: string;
      username: string;
      avatar: string;
      email: string;
      role?: string;
      expires_at?: string;
      updated_at?: string;
      created_at?: string;
      access_token?: string; //encrypt this later
      refresh_token?: string; //encrypt this later
    };
  } catch (e) {
    if (e instanceof ValidationError) {
      throw e;
    }

    handlePgError(e);
  }
};

export const AddUserToDb = async (arg: {
  challonge_id: string;
  username: string;
  email: string;
  access_token?: string;
  refresh_token?: string;
  expires_at?: Date;
  avatar?: string | null;
  role?: string | null; //Add enums later
}) => {
  try {
    const query = {
      text: `INSERT INTO users
(challonge_id, username, email, avatar, role, access_token, refresh_token, expires_at)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
ON CONFLICT (challonge_id) DO UPDATE
SET 
    username = COALESCE(EXCLUDED.username, users.username),
    avatar = COALESCE(EXCLUDED.avatar, users.avatar),
    email = COALESCE(EXCLUDED.email, users.email),
    access_token = COALESCE(EXCLUDED.access_token, users.access_token), 
    refresh_token = COALESCE(EXCLUDED.refresh_token, users.refresh_token), 
    expires_at = COALESCE(EXCLUDED.expires_at, users.expires_at)    
RETURNING challonge_id, username, role;
    `,
      values: [
        arg.challonge_id,
        arg.username,
        arg.email,
        arg.avatar,
        arg.role,
        arg.access_token,
        arg.refresh_token,
        arg.expires_at,
      ],
    };
    const res = await pool.query(query);

    return { user: res.rows[0] };
  } catch (e) {
    handlePgError(e);
  }
};

export const UpdateUserFromDb = async (
  identifier: string,
  data: {
    username?: string;
    email?: string;
    access_token?: string;
    refresh_token?: string;
    expires_at?: Date;
    avatar?: string | null;
    role?: string | null; //Add enums later
  },
) => {
  const { id, setClause, values } = DbUpdateHelper({ updates: data });

  //const allowedField = ["note", "address", "status"];

  /// const isNotAllowed = fields.some(
  ///  (field) => !allowedField.includes(field.toLowerCase()),
  //);

  //if (isNotAllowed) {
  // throw new CustomError("Invalid field!", 400);
  // }

  try {
    let query_text = `
          UPDATE users
          SET ${setClause} 
          WHERE challonge_id = $${id} 
          RETURNING id, username;         
          `;

    const query = {
      text: query_text,
      values,
    };
    const res = await pool.query(query);

    return res.rows[0] as { id: string };
  } catch (e) {
    console.log(e);
    handlePgError(e);
  }
};

//Admin
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
    console.log(e);
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

*/
