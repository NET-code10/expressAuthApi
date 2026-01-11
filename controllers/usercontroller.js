import env from "../configs/env.config.js";
import {
  createUserModel,
  findLoginModel,
  findSignupModel,
  get_countDocuments,
  findUserById,
} from "../models/usermodels.js";
import {
  comparePasswords,
  hashPassword,
} from "../utilities/hashinp_password_compare.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import {
  createRefreshToken,
  createAccessToken,
} from "../utilities/createtoken.js";

export async function createUserController(req, res, next) {
  let { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(403).send({ message: "please fill all blanks" });
  }
  // check if user exist
  let userExist = await findSignupModel(req.body);

  if (!userExist) {
    // Hash the password with the salt
    const hashedPassword = await hashPassword(password);

    let currentUser = await createUserModel({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });

    let accessToken = await createAccessToken(currentUser);
    let RefreshToken = await createRefreshToken(currentUser);

    res.cookie("accesstoken", accessToken, {
      httpOnly: true,
      secure: true,
      maxAge: 60 * 60 * 1000, // 1 hour
      sameSite: "none",
    });
    res.cookie("refreshtoken", RefreshToken, {
      httpOnly: true,
      secure: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7d,
      sameSite: "none",
    });
    // finally jump to the next midddleware to send success message

    req.user = currentUser;

    return next();
  } else {
    return res
      .status(409)
      .send({ message: "submision failed please try later!" });
  }
}

export async function userLoginController(req, res, next) {
  try {
    let entredPassword = req.body.password;
    let userExist = await findLoginModel(req.body);
    if (!userExist) {
      return res.status(401).send("invalid email or password");
    }
    //  compare password if false return invalid crenditals
    let storedPassword = userExist.password;
    let comparedResult = await comparePasswords(entredPassword, storedPassword);
    if (!comparedResult) {
      return res.status(401).send("invalid email or password  ");
    }

    let payload = {
      id: userExist._id,
      username: userExist.username,
    };

    // create access token
    let accessToken = await createAccessToken(payload);
    let RefreshToken = await createRefreshToken(payload);

    res.cookie("accesstoken", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",

      maxAge: 60 * 60 * 1000, // 1 hour
    });
    res.cookie("refreshtoken", RefreshToken, {
      httpOnly: true,
      secure: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7d
      sameSite: "none",
    });

    req.user = userExist;
    return next();
  } catch (er) {
    console.log(process.cwd() + " user insertion " + er.message);
  }
}

// logout logic

export async function userLogoutController(req, res, next) {
  res.clearCookie("accesstoken", {
    httpOnly: true,
    secure: true,
    maxAge: 60 * 60 * 1000, // 1 hour
    sameSite: "none",
  });
  res.clearCookie("refreshtoken", {
    httpOnly: true,
    secure: true,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7d
    sameSite: "none",
  });

  return res.status(200).send("logout succcessfully");
}

export async function checkOuthController(req, res, next) {
  let accesstoken = req.cookies?.accesstoken;
  if (!accesstoken) {
    return res.status(401).send("token required ");
  }

  let user = jwt.verify(accesstoken, env.SECRET_KEY, (error, data) => {
    if (error) {
      return null;
    }

    // here call database using _id to fetch user data
    // let user = await findUserById()
    return data;
  });
  if (!user) return res.status(403).send(" invalid or expired token");

  let userProfile = await findUserById(user);

  if (!userProfile)
    return res.status(403).send("invalid token please try later");

  req.user = userProfile;
  return next();
}
