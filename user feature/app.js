//jshint esversion:6

require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const app = express();
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const findOrCreate = require("mongoose-findorcreate");
//console.log(process.env.API_KEY);

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(
  session({
    secret: "Our little secret.",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

// mongoose.connect("mongodb+srv://Jeeya:jeeya28@cluster0.ae9il1u.mongodb.net/userDB");
// mongoose.connect(
//   //"mongodb+srv://AayushJivani:1pt3B9wiE1jb8cq9@cluster0.6ec6op9.mongodb.net/userDB"
  
  
// );
 const DB ="mongodb+srv://AayushJivani:1pt3B9wiE1jb8cq9@cluster0.6ec6op9.mongodb.net/userDB"

mongoose.connect(DB).then(
  () => {

    console.log("DB is Connected succesfully");
  }
)
// mongoose.set("useCreateIndex",true);

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  googleId: String
});

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

const User = new mongoose.model("User", userSchema);

passport.use(User.createStrategy());

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id)
    .then(user => {
      done(null, user);
    })
    .catch(err => {
      done(err, null);
    });
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/google/secrets",
      userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
    },
    function (accessToken, refreshToken, profile, cb) {
      console.log(profile);
      User.findOrCreate({ googleId: profile.id }, function (err, user) {
        return cb(err, user);
      });
    }
  )
);

app.get("/", function (req, res) {
  res.render("home");
});

// app.get("/auth/google", function (req, res) {
//   passport.authenticate("google");
// });



app.get("/auth/google",
  passport.authenticate("google", { scope: ["profile"] }));

app.get("/auth/google/secrets", 
  passport.authenticate("google", { failureRedirect: "/login" }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect("/secrets");
  });



app.get("/login", function (req, res) {
  res.render("login");
});

app.get("/register", function (req, res) {
  res.render("register");
});

app.get("/secrets", function (req, res) {
  isAuthenticated(req)
    .then((authenticated) => {
      if (authenticated) {
        res.render("secrets");
      } else {
        res.redirect("/login");
      }
    })
    .catch((error) => {
      // Handle any errors that occurred during authentication
      console.error("Authentication error:", error);
      res.status(500).send("Internal Server Error");
    });
});

app.get("/submit", function(req,res){
  isAuthenticated(req)
  .then((authenticated) => {
    if (authenticated) {
      res.render("submit");
    } else {
      res.redirect("/login");
    }
  })
  .catch((error) => {
    // Handle any errors that occurred during authentication
    console.error("Authentication error:", error);
    res.status(500).send("Internal Server Error");
  });
})

function isAuthenticated(req) {
  return new Promise((resolve, reject) => {
    // Perform authentication logic here
    // You can replace the code below with your own authentication mechanism

    if (req.isAuthenticated()) {
      resolve(true);
    } else {
      resolve(false);
    }
  });
}

app.get("/logout", function (req, res) {
  logout(req)
    .then(() => {
      res.redirect("/");
    })
    .catch((error) => {
      console.error("Logout error:", error);
      res.status(500).send("Internal Server Error");
    });
});

// Function to perform logout operation
function logout(req) {
  return new Promise((resolve, reject) => {
    req.logout((error) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
}

app.post("/register", function (req, res) {
  User.register({ username: req.body.username }, req.body.password,function(err,user){
    if(err){
      console.log(err);
      res.redirect("/register");
    }
    else{
      passport.authenticate("local")(req,res,function(){
        res.redirect("/secrets");
      });
    }
  });
    
});

app.post("/login", function (req, res) {
  const user = new User({
    username: req.body.username,
    password: req.body.password,
  });

  req.login(user, function (err) {
    if (err) {
      console.log(err);
    } else {
      passport.authenticate("local")(req, res, function () {
        res.redirect("/secrets");
      });
    }
  });
});

app.post("/submit", function(req,res){
  const submittedSecret = req.body.secret;

  console.log(req.user.id);

  User.findById(req.user)
  .then(foundUser => {
    if (foundUser) {
      foundUser.secret = submittedSecret;
      return foundUser.save();
    }
  })
  .then(() => {
    res.redirect("secrets");
  })
  .catch(err => {
    console.error(err);
    // Handle the error appropriately
    res.status(500).send("Internal Server Error");
  });

});

app.listen(3000, function () {
  console.log("Server started on port 3000.");
});

// mongoose.connect("mongodb+srv://Jeeya:jeeya28@cluster0.ae9il1u.mongodb.net/userDB");

// //jshint esversion:6
// require('dotenv').config()
// const express = require("express");
// const bodyParser = require("body-parser");
// const ejs = require("ejs");
// const mongoose = require("mongoose");
// const md5 = require('md5');
// // const encrypt = require("mongoose-encryption");
// const app = express();

// app.use(express.static("public"));
// app.set('view engine','ejs');
// app.use(bodyParser.urlencoded({
//     extended:true
// }));

// mongoose.connect("mongodb+srv://AayushJivani:1pt3B9wiE1jb8cq9@cluster0.6ec6op9.mongodb.net/userDB");

// const userSchema = new mongoose.Schema({
//     email: String,
//     password: String
// });

// // userSchema.plugin(encrypt,{secret: process.env.SECRET, encryptedFields:["password"]});
// const User = new mongoose.model("User",userSchema);

// app.get("/", function(req,res){
//     res.render("home");
// });

// app.get("/login", function(req,res){
//     res.render("login");
// });

// app.get("/register", function(req,res){
//     res.render("register");
// });

// app.post("/register",function(req,res){
//     const newUser = new User({
//         email: req.body.username,
//         password: md5(req.body.password)
//     });

//     newUser.save()
//     .then(() => {
//       res.render("secrets");
//     })
//     .catch((err) => {
//       console.log(err);
//     });

// });

// app.post("/login",function(req,res){
//     const username = req.body.username;
//     const password = md5(req.body.password);

//     User.findOne({ email: username })
//     .then((foundUser) => {
//       if (foundUser) {
//         if (foundUser.password === password) {
//           res.render("secrets");
//         }
//         // else{
//         //     res.write("Wrong password");
//         // }
//       }
//     })
//     .catch((err) => {
//       console.log(err);
//     });

// })

// app.listen(3000,function(){
//     console.log("Server started on port 3000.");
// });

// // mongoose.connect("mongodb+srv://Jeeya:jeeya28@cluster0.ae9il1u.mongodb.net/userDB");
