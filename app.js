require("dotenv").config();
const express = require("express");
// const morgan = require("morgan");
const path = require("path");

const app = express();
const mongoose = require("mongoose");

const cookieParser = require("cookie-parser");
const DefaultData = require("./defaultData");

require("./db/connec");
const routes = require("./router/router");
const Products = require("./models/productsschema");
const cors = require("cors");

app.use(express.json());
app.use(cookieParser());
const corsOptions = {
  credentials: true,
  exposedHeaders: ["Authorization", "Content-Type"],
};
app.use(cors(corsOptions));
// app.use(morgan("dev"));

app.use(routes);

app.use(express.static(path.join(__dirname, "./amazon-clone/build")));
app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "./amazon-clone/build/index.html"));
});

const port = process.env.PORT || 8005;
app.listen(port, () => {
  console.log(`server is listen on port number ${port}`);
});

DefaultData;
