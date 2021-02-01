import { app } from "./app";
import { devApp } from "./devApp";

const port = 3000;
if (process.env.production) {
  app.listen(port);
} else {
  devApp.listen(port);
  console.log("devMode");
}
