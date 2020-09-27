const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const compression = require("compression");

const PORT = 3000;

const app = express();

app.use(logger("dev"));

app.use(compression());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));
//mongodb+srv://mayodee597:rT7)tP2&qs@cluster0.kul51.mongodb.net/budget?retryWrites=true&w=majority
mongoose.connect("mongodb+srv://mayodee597:rT7)tP2&qs@cluster0.kul51.mongodb.net/budget?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true
});

// routes
app.use(require("./routes/api.js"));


app.listen(process.env.PORT || 3000, () => {
  console.log("App running on port 3000!");
});
