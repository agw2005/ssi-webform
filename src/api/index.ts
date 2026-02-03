import express from "express";

const app = express();

app.get("/", (_, res) => {
  res.send("Hello World");
});

app.listen(3067, () => {
  console.log("Server is running on http://localhost:3067");
});
