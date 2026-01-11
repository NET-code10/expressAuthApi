import express from "express";
import axios from "axios";

let Routes = express.Router();
import {
  createUserController,
  userLogoutController,
  userLoginController,
  checkOuthController,
} from "../controllers/usercontroller.js";

Routes.post("/register", createUserController, (req, res) => {
  return res.status(200).json({
    success: true,
    ...req.user._id,
  });
});

Routes.post("/login", userLoginController, (req, res) => {
  return res.status(200).json({
    success: true,
    ...req.user._id,
  });
});

Routes.get("/logout", userLogoutController);

Routes.get("/profile", checkOuthController, (req, res) => {
  return res.status(200).send(req.user);
});
Routes.post("/refresh", (req, res) => {
  let refreshtoken = req.cookies.refreshtoken;
  if (!refreshtoken) {
    return res.send("invalid refresh token or expired ");
  }
  // create new access token
  res.cookie("accesstoken", {
    httpOnly: true, // ✅ correct spelling
    secure: false, // ⚠️ set to true in production (requires HTTPS)
    maxAge: 60 * 60 * 1000, // 1 hour
  });
  res.redirect(req.originalUrl);
});

export default Routes;
