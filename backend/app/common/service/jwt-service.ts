
import { type IUser } from "../../user/user.dto";
import * as userService  from "../../user/user.service";
import bcrypt from "bcrypt";
import dayjs from "dayjs";
import { type Request } from "express";
import createError from "http-errors";
import jwt from "jsonwebtoken";
import passport from "passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Strategy as LocalStrategy } from "passport-local";

export const isValidPassword = async function (
  value: string,
  password: string
) {
  const compare = await bcrypt.compare(value, password);
  return compare;
};

export const initPassport = (): void => {
  passport.use(
    new Strategy(
      {
        secretOrKey: process.env.JWT_SECRET,
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      },
      async (token: { user: Request["user"] }, done) => {
        try {
          done(null, token.user);
        } catch (error) {
          done(error);
        }
      }
    )
  );

  // user login
  passport.use(
    "login",
    new (LocalStrategy as any)(
      {
        usernameField: "email",
        passwordField: "password",
      },
      async (email: string, password: string, done: any) => {
        try {
          const user = await userService.getUserByEmail(email, {
            password: true,
            name: true,
            email: true,
            role: true,
            kycStatus: true,
          });

          if (!user) {
            return done(createError(401, "User not found"), false);
          }

        //   if (user.isBlocked) {
        //     return done(createError(403, "User is blocked"), false);
        //   }

          const validPass = await isValidPassword(password, user.passwordHash!);

          if (!validPass) {
            return done(createError(401, "Invalid email or password"), false);
          }

          const userPlain = (user as any).toObject ? (user as any).toObject() : user;
          const { password: _p, ...safeUser } = userPlain;
          return done(null, safeUser);
        } catch (err: any) {
          return done(createError(500, err.message), false);
        }
      }
    )
  );
};


export const createUserTokens = (user: Omit<IUser, "passwordHash">) => {
  const jwtSecret = process.env.JWT_SECRET ?? "";
  const payload = { ...user, sub: user.id };
  const accessToken = jwt.sign(payload, jwtSecret, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY ?? ("30m" as any),
  });
  const refreshToken = jwt.sign(payload, jwtSecret, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY ?? ("2d" as any),
  });
  return { accessToken, refreshToken };
};

export const decodeToken = (token: string) => {
  // const jwtSecret = process.env.JWT_SECRET ?? "";
  const decode = jwt.decode(token) as jwt.JwtPayload;
  const expired = dayjs.unix(decode.exp!).isBefore(dayjs());
  return { ...decode, expired } as IUser & {
    iat: number;
    exp: number;
    expired: boolean;
  };
};

export const verifyToken = (token: string) => {
  const jwtSecret = process.env.JWT_SECRET ?? "";
  if (!token) throw createError(401, "Token missing");
  const decode = jwt.verify(token, jwtSecret);
  return decode as IUser;
};