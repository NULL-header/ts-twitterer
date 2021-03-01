import React from "react";
import ReactDOM from "react-dom";

import { App } from "./app";
import { UpdateButton } from "./components/ForDev";

ReactDOM.render(
  <>
    <App />
    <UpdateButton />
  </>,
  document.getElementById("root"),
);
