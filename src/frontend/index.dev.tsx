import React from "react";
import ReactDOM from "react-dom";

import { Provider } from "./globalState";
import { LoadContainer } from "./components";
import { UpdateButton } from "./components/ForDev";

ReactDOM.render(
  <Provider>
    <LoadContainer />
    <UpdateButton />
  </Provider>,
  document.getElementById("root")
);
