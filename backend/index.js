const express = require("express");
require("dotenv").config();
const dbConnect = require("./configs/dbConnect");
const initRoutes = require("./routes");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    methods: ["POST", "GET", "PUT", "DELETE"],
    credentials: true,
  })
);
console.log("Client: " + process.env.CLIENT_URL);
app.use(cookieParser(process.env.COOKIE_PARSER));

const port = process.env.PORT || 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

dbConnect.connect();
initRoutes(app);

app.use("/", (req, res) => {
  res.send("SEVER ON");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
