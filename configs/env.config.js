import dotenv from "dotenv";
 dotenv.config({ path: process.cwd() + "/.env" });

let env = {
  LOCAL_DB: process.env.URL,
  PORT: Number(process.env.PORT),
  SECRET_KEY: process.env.SECRET_KEY,
  ATLAS_DB_URL: process.env.ATLAS_DB_URL,
};

export default env;
