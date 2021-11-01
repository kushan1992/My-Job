const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const postRoute = require("./routes/posts");
const userRoute = require("./routes/user");
const jobRoute = require("./routes/jobs");

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use("/posts", postRoute);
app.use("/user", userRoute);
app.use("/job", jobRoute);

module.exports = app;
