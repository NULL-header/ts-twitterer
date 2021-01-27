import express from "express";

const app = express();

app.use(express.static("public"));

app.get("/api/ping", (req, res) => {
  res.send({ response: "pong!" });
});

app.listen(3000);
