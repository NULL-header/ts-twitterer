import express from "express";
import session from "express-session";
import redis from "redis";
import makeRedisStore from "connect-redis";
import { router } from "./router";
import { CONSTVALUE } from "./CONSTVALUE";

const RedisStore = makeRedisStore(session);
const redisClient = redis.createClient();

export const app = express()
  .use(
    session({
      name: "ts-twitterer",
      secret: CONSTVALUE.COOKIE_SECRET,
      store: new RedisStore({ client: redisClient }),
      resave: false,
      rolling: true,
      saveUninitialized: false,
      cookie: {
        maxAge: 60 * 60 * 1000 * 24 * 365,
        httpOnly: true,
        secure: false,
      },
    }),
  )
  .use(router);
