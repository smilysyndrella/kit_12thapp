var express = require("express"),
    app     = express(),
    ejs               = require("ejs"),
    passport          = require("passport"),
    plm               = require("passport-local-mongoose"),
    mongoose          = require("mongoose"),
    LocalStrategy     = require("passport-local");




var DB_URL= "mongodb://localhost/12thapp";

mongoose.connect(DB_URL, {
  useMongoClient: true,
});



app.set("view engine","ejs");
app.use(express.static("public"));

app.use(passport.initialize());
app.use(passport.session());


// user schema
var UserSchema = mongoose.Schema({
    username: {
       type: String,
       index: true

   },
    email: {
       type: String
   },
   phonenumber: {
       type: String
   },
     password: {
        type: String,
    },
});
UserSchema.plugin(plm);

var User = mongoose.model("User", UserSchema);

// SERIALIZE AND DESERIALIZE USER
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// get routes
app.get("/",function(req,res){
  res.render("index");
})

app.get("/register",function(req,res){
  res.render("register");
})

// // post routes
// app.post("/register",function(req,res){
//
//var fullname = req.body.name,
//     email    = req.body.email,
//     number   = req.body.number,
//     password = req.body.password;
//
//
//   User.register(new User({
//       username: fullname,
//       email: email,
//       phonenumber: number
//       }),
//       req.body.password,function(err,user){
//       passport.authenticate("local")(req,res,function(){
//           console.log(user);
//           // req.flash('success','You are Registered and now can LogIn');
//           res.redirect("/login");
// });
//

app.post("/register", function(req,res){
var name =req.body.fullname;
   User.register(new User({
     username: name,
     email: req.body.email
   }), req.body.password, function(err, newid){
        if(err){
            console.log(err);
            return res.send(err);
         }
        passport.authenticate("local")(req, res, function(){
            res.render("/login");
            console.log("newid");

        });


    })

});


app.listen(8080,()=>{
  console.log("server started at port 8080")
})
