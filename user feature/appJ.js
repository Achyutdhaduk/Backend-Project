//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));


//mongoose.connect("mongodb://127.0.0.1:27017/userDB", { useNewUrlParser: true });
mongoose.connect("mongodb+srv://Jeeya:jeeya28@cluster0.ae9il1u.mongodb.net/userDB");

const userSchema = {
    email: String, 
    password: String
}

const User = new mongoose.model("User", userSchema);



app.get("/", function(req, res){
    res.render("home");
});

app.get("/login", function(req, res){
    res.render("login");
});

app.get("/register", function(req, res){
    res.render("register");
});

app.post("/register", function(req, res) {
    const newUser = new User({
      email: req.body.email,
      password: req.body.password
    });
  
    newUser.save()

      .then(()=> {
        res.render("secrets");
      })
      .catch((err)=> {
        console.log(err);
        
      });
    
  });


  app.post("/login",function(req,res){
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({ email: username })
    .then((foundUser) => {
      if (foundUser) {
        if (foundUser.password === password) {
          res.render("secrets");
        }
        // else{
        //     res.write("Wrong password");
        // }
      }
    })
    .catch((err) => {
      console.log(err);
    });
  

})





app.listen(3000, function () {
    console.log("Server started on port 3000");
  });