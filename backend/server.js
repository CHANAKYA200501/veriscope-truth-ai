const express = require("express");

const cors = require("cors");

const mongoose =
  require("mongoose");


const app = express();


app.use(cors());

app.use(express.json());


mongoose.connect(

"mongodb://127.0.0.1:27017/veriscope"

);


app.use(

"/api/analysis",

require("./routes/analysisRoutes")

);


app.listen(

5000,

() =>

console.log("Server running")

);