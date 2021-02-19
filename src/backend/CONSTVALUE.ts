import Dotenv from "dotenv";

Dotenv.config();

export const CONSTVALUE = {
  MAIN_HTML: "/public/index.html",
  ACCESS_TOKEN: process.env.ACCESS_TOKEN as string,
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET as string,
  CONSUMER_TOKEN: process.env.CONSUMER_TOKEN as string,
  CONSUMER_TOKEN_SECRET: process.env.CONSUMER_TOKEN_SECRET as string,
  PORT: (parseInt(process.env.PORT as string, 10) || 3000) as number,
  SAMPLE_DIRECTORY: `${process.cwd()}/samples/`,
  SAMPLE_BASE_NAME: "sample",
};
