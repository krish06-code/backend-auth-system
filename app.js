const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const path = require('path');
const userModel = require('./models/user');
const postModel = require('./models/post')
const cookieParser = require('cookie-parser');

app.set("view engine","ejs");
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

app.get('/', (req,res)=>{
    res.render("index")
})

app.get('/login', (req,res)=>{
    res.render("login")
})

app.post('/register', async (req,res)=>{
    let {email,name,username,age,password} = req.body;

    let user = await userModel.findOne({email}) // we are checking if the user has already account or not?
    if(user) return res.status(500).send("user already registered")

        bcrypt.genSalt(10,(err,salt)=>{
            bcrypt.hash(password,salt, async (err,hash)=>{
                let user = await userModel.create({
                    username,
                    email,
                    age,
                    name,
                    password: hash
                })

                
        let token = jwt.sign({email: email, userid: user._id}, "secret")
        res.cookie("token",token);
        res.send("registered")

            })
        })

})

app.post('/login', async (req,res)=>{
    let {email,password} = req.body;

    let user = await userModel.findOne({email}) // we are checking if the user has already account or not?
    if(!user) return res.status(500).send("Something Went Wrong")

       bcrypt.compare(password,user.password,function(err,result){
        if(result){
            let token = jwt.sign({email: email, userid: user._id}, "secret")
            res.cookie("token",token);
             res.status(200).send("you can Login");
        }

        else res.redirect('/login');
       })

})

app.get('/logout', (req,res)=>{
    res.cookie("token","");
    res.redirect('/login');
})

app.get('/profile',isLoggedIn, (req,res)=>{
    console.log(req.user);
    res.redirect('/login');
    
})

function isLoggedIn(req,res,next){
    if(req.cookie.token == "") res.send("you have to log in first");
    else {
        let data = jwt.verify(req.cookie.token, "secret");
        req.user = data
        next();
    }
    // this is called creating protected routes..
    // here we are creating a middleware to check if we are logged in or not this first check the cookie if it is there if it is there than it verifies our data using jwt and secret that is it verifies our email and password from that token if it is correct than it saves it to a field user in res and we can send this response to any of the route like iam sending it to profile route
}

app.listen(3000)