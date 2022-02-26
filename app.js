require("dotenv").config();
const express = require("express");
const mongoose  = require("mongoose");
const ejs = require("ejs");
const bodyparser = require("body-parser");
const bcrypt = require("bcrypt");

const app = express();

app.use(bodyparser.urlencoded({extended:true}));
app.use(express.static("public"));

app.set("view engine","ejs");

mongoose.connect("mongodb://localhost:27017/"+process.env.DATABASE_NAME);

const userSchema =new mongoose.Schema({
    email:String,
    password:String
})

const User =new mongoose.model("User", userSchema);

app.listen(3000, ()=> console.log("Server started on port 3000"));

app.get("/", (req,res)=>{
    res.render("home");
})

app.get("/register",(req,res)=>{
    res.render("register");
})

app.get("/login",(req,res)=>{
    res.render("login");
})

app.post("/register", (req,res)=>{
    
    let password=req.body.password;

    bcrypt.hash(password , 10 , function(err, hash) {
        
        password= hash;
        const user =new User({
            email: req.body.email,
            password: password
        });
    
        user.save((err,result)=>{
            res.redirect("login");
        })
    });

    
})

app.post("/login", (req,res)=>{

    const password=req.body.password;

    User.findOne({email: req.body.email} ,(err,result)=>{
        if(!err)
        {
            if(result)
            {
                bcrypt.compare(password, result.password, function(err, passResult) {
                    if(passResult)
                        res.render("secrets");
                });
                
            }
        }
    })
})