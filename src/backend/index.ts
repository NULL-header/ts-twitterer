import { app } from "./app";
import { devApp } from "./devApp";
import { CONSTVALUE } from "./CONSTVALUE";

if (process.env.production) {
  app.listen(CONSTVALUE.PORT);
} else {
  devApp.listen(CONSTVALUE.PORT);
  console.log("devMode");
}
