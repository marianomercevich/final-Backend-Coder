import passport from "passport";
import { passportCallCurrent, passportCall } from "../utils/utils.js";
import appRouter from "./router.js";
import {
  changePasswordController,
  errorPageController,
  errorResetPassController,
  failLoginController,
  failRegisterController,
  githubCallbackController,
  loginGithubController,
  passwordResetController,
  passwordResetEmailController,
  sendNewPasswordController,
  userCurrentController,
  userLoginController,
  userLogoutController,
  userRegisterController,
  viewLoginController,
  viewRegisterController,
} from "../controllers/userJWT.controller.js";

export default class JWTRouter extends appRouter {
  init() {
    this.post(
      "/register",
      ["PUBLIC"],
      passport.authenticate("register", {
        session: false,
        failureRedirect: "/api/jwt/failRegister",
      }),
      userRegisterController
    );
    this.get("/failRegister", ["PUBLIC"], failRegisterController);

    this.get("/register", ["PUBLIC"], viewRegisterController);

    this.post(
      "/login",
      ["PUBLIC"],
      passport.authenticate("login", {
        session: false,
        failureRedirect: "/api/jwt/failLogin",
      }),
      userLoginController
    );
    this.get("/failLogin", ["PUBLIC"], failLoginController);

    this.get("/login", ["PUBLIC"], viewLoginController);

 
    this.get(
      "/github",
      ["PUBLIC"],
      passport.authenticate("github", { scope: ["user:email"] }),
      loginGithubController
    );
    this.get(
      "/githubcallback",
      ["PUBLIC"],
      passport.authenticate("github", { session: false }),
      githubCallbackController
    );

  
    this.get("/logout", ["PUBLIC"], passportCall("jwt"), userLogoutController);
    this.get("/error", ["PUBLIC"], errorPageController);
    this.get("/errorResetPass", ["PUBLIC"], errorResetPassController);


    this.get(
      "/current",
      ["PUBLIC"],
      passportCallCurrent("current"),
      userCurrentController
    );


    this.get("/passwordReset", ["PUBLIC"], passwordResetController);
    this.post("/passwordReset", ["PUBLIC"], passwordResetEmailController);
    this.get("/passwordReset/:tid", ["PUBLIC"], changePasswordController);
    this.post("/changePassword/:tid", ["PUBLIC"], sendNewPasswordController);
  }
}
