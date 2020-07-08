const exp=require('express');
const app= exp();
const port=process.env.PORT||3000;
const path=require('path');
const explayout= require("express-ejs-layouts");
const mong = require("mongoose");
const flash=require("connect-flash");
const session=require("express-session");
const passport= require("passport");
const local= require("passport-local").Strategy;
const bcrypt=require("bcryptjs");
const User=require("./models/User");

mong.connect("mongodb://localhost/firstdb",
{   useNewUrlParser: true ,
    useUnifiedTopology: true
})
.then(()=>console.log("connected"))
.catch((err)=>console.log("not connected",err));



passport.use( new local({
    usernameField:'email',
    passReqToCallback:true},
    (req,email,psd,done)=>{
        User.findOne({email:email})
        .then(user=>{
            if(!user) return done(null,false,req.flash('error2',"email not registered"));
            bcrypt.compare(psd,user.psd,(err,ism)=>{
                if(err) throw err;
                if(ism) return done(null,user);
                return done(null,false,req.flash('error2',"paswd not amched"));
            });
        })
        .catch(err=>console.log("mot found user"))
    })
);

passport.serializeUser((user, done) =>{
    done(null, user.id);
});  
passport.deserializeUser((id, done)=> {
    User.findById(id, (err, user)=>   {
    done(err, user);
});
});


app.use(explayout);
app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);

app.use(exp.urlencoded({extended:false}));

app.use(exp.static(path.join(__dirname,'public')));


app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
}));


app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

// GLOBAL
app.use((req,res,next)=>{
    res.locals.success_msg=req.flash('success_msg');
    res.locals.error_msg=req.flash('error_msg');
    res.locals.error2=req.flash('error2');
    next();
});

app.use('/',require("./routes/index"));
app.use('/login',require("./routes/login")); 
app.use('/register',require("./routes/register"));
app.use('/user',require("./routes/user"));
app.listen(port);