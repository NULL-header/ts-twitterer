import { app } from "./app";
import { devApp } from "./devApp";

const port = 8080;
if (process.env.production) {
  app.listen(port);
} else {
  devApp.listen(port);
  console.log("devMode");
}
