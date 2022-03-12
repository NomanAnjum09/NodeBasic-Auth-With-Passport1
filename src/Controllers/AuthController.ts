import { NextFunction, Request, Response } from "express";
import passport from "passport";
import "../Passport";
import passportJwt from "passport-jwt";
import Users from "../Models/UserModel"
import { IUser } from "../Interfaces/IUser";
import jwt_decode from "jwt-decode";

const JwtStrategy = passportJwt.Strategy;
const ExtractJwt = passportJwt.ExtractJwt;
const JWT_SECRET = process.env.JWTSECRET || ""


export class AuthController {

  public authenticateJWT(req: Request, res: Response, next: NextFunction) {
    passport.authenticate("jwt", function (err, user, info) {
      if (err) {
        console.log(err);
        return res.status(401).json({ status: "error", code: "unauthorized" });
      }
      if (!user) {
        return res.status(401).json({ status: "error", code: "unauthorized" });
      } else {
        return next();
      }
    })(req, res, next);
  }

  public authorizeAdminJWT(req: Request, res: Response, next: NextFunction) {
    passport.authenticate("jwt", function (err, user, jwtToken) {
      if (err) {
        console.log(err);
        return res.status(401).json({ status: "error", code: "unauthorized" });
      }
      if (!user) {
        return res.status(401).json({ status: "error", code: "unauthorized" });
      } else {
        const scope = req.baseUrl.split("/").slice(-1)[0];
        const authScope = jwtToken.scope;
        console.log(authScope)
        if (authScope && authScope==1) {
          return next();
        }
        else {
          return res.status(401).json({ status: "error", code: "unauthorized" });
        }
      }
    })(req, res, next);
  }

  public AuthenticateSelfJWT(user: IUser){
    passport.use(new JwtStrategy(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: JWT_SECRET
      }, function (jwtToken, done) {
        Users.findOne({ Email: jwtToken.Email }, function (err: any, userFromJWT: any) {
          if (err) { return false; }
          if (user) {
            return (userFromJWT._id === user._id && userFromJWT.Email == user.Email);
          } else {
            false;
          }
        });
      }));
}
public static async GetUser(request: Request): Promise<IUser | null>{
  if (request.headers && request.headers.authorization) {
    var authorization = request.headers.authorization.split(' ')[1],
        decoded:any;
    try {
        decoded = jwt_decode(authorization);
    } catch (e) {
      console.log(e);
        return null;
    }
    console.log(decoded)
    var userId = decoded.username;
    const user:IUser | null = await Users.findOne({Email: userId});
    console.log(user)
    return user;
}
return null;
  
}
}