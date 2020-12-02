//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require('mongoose-encryption');
const port = process.env.PORT || 3000;
const app = express();

mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true, useUnifiedTopology: true });

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

const userSchema = new mongoose.Schema({
  email : String,
  password : String
});


userSchema.plugin(encrypt, { secret : process.env.DB_SECRET , encryptedFields : ["password"]});

const User = mongoose.model("User", userSchema);

app.get('/', function(req, res) {
  res.render('home');
});

app.route("/login")

.get(function(req, res) {
  res.render('login');
})

.post(function(req, res) {
  const username = req.body.username;
  const password = req.body.password;
  User.findOne(
    { email : username },
    function(err, foundUser) {
      if(!err) {
        if(foundUser) {
          if (foundUser.password === password) { res.render('secrets'); }
          else { res.render('/login'); }
        }
        else { res.render('/login'); }
      }
      else { console.log(err); }
    }
  );
});


app.route("/register")

.get(function(req, res) {
  res.render('register');
})

.post(function(req, res) {
  const newUser = new User({
    email : req.body.username,
    password : req.body.password
  });

  newUser.save(function(err) {
    if(err) { console.log(err); }
    else { res.render('secrets'); }
  })

});


app.listen(port, function() {
  console.log(`Server started on http://localhost:${port}`);
});
