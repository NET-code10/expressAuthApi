import jwt from "jsonwebtoken";
import env from "../configs/env.config.js";

export async function createAccessToken(user) {
  let secretkey = env.SECRET_KEY;
  let expireTime = "1h";
  let payload = {
    id: user.id,
    username: user.username,
  };

  let accessToken = await jwt.sign(payload, secretkey, {
    expiresIn: expireTime,
  });
  return accessToken;
}

export async function createRefreshToken(user) {
  let secretkey = env.SECRET_KEY;
  let expireTime = "7d";
  let payload = {
    id: user.id,
    username: user.username,
  };

  let RefreshToken = await jwt.sign(payload, secretkey, {
    expiresIn: expireTime,
  });
  return RefreshToken;
}
