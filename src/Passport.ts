import passport from "passport";
// import passportApiKey from "passport-headerapikey";
import passportJwt from "passport-jwt";
import Users from "./Models/UserModel"
import bcrypt from "bcrypt-nodejs";
import * as jwt from "jsonwebtoken";

const JwtStrategy = passportJwt.Strategy;
const ExtractJwt = passportJwt.ExtractJwt;
const localStrategy = require('passport-local').Strategy;


const JWT_SECRET = process.env.JWTSECRET || ""

passport.use(
    'login',
    new localStrategy(
      {
        usernameField: 'email',
        passwordField: 'password'
      },
      async (email:string, password:string, done:any) => {
        try {
            console.log(email)
          const user = await Users.findOne({ email });
          if (!user) {
            return done(null, false, { message: 'User not found' });
          }
  
          const validate = await user.Password === bcrypt.hashSync(password, bcrypt.genSaltSync(10));
          ;
  
          if (!validate) {
            return done(null, false, { message: 'Wrong Password' });
          }
          const token = jwt.sign({ username: email, scope : null }, JWT_SECRET);

          return done(null, user, { message: 'Logged in Successfully' });
        } catch (error) {
          return done(error);
        }
      }
    )
  );


passport.use(new JwtStrategy(
  {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: JWT_SECRET
  }, function (jwtToken, done) {
    Users.findOne({ Email: jwtToken.Email }, function (err: any, user: any) {
      if (err) { return done(err, false); }
      if (user) {
        return done(undefined, user , jwtToken);
      } else {
        return done(undefined, false);
      }
    });
  }));


