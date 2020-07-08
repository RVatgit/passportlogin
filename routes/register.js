const exp=require('express');
const app= exp.Router();
const {check,body,validationResult}=require("express-validator");
const User=require('../models/User');
const bcrypt=require('bcryptjs');



app.get('/',(req,res)=>{
    res.render('register');
});



app.post('/',[
    check('name',"Name canot be Empty!!").isEmpty(),
    check('email',"Enter valid email").custom((value)=>{
        return  User.findOne({email:value})
        .then((user)=> {
            if(user) return Promise.reject("Eamil Already in use");
        });
    }),
    check('password',"Enter valid Password").isLength({min:5}).isAlphanumeric().custom
    ((value,{req})=>{
        if(value!=req.body.password2)
            throw new Error('password do not match!!');
        return true;
    })
]
,(req,res)=>{
    //check required fields
    const error=validationResult(req);

    if(!error.errors){
        return res.render('register',{
            errors:error,
            old:req.body
        });
    }
    else{
        const newuser=new User({
            name:req.body.name,
            email:req.body.email,
            psd:req.body.password
        });
        // console.log("NEWUER",newuser);
        bcrypt.genSalt(10,(err,salt)=>{
            bcrypt.hash(newuser.psd,salt,(err,hashp)=>{
                if(err) throw err;
                newuser.psd=hashp;
                newuser.save()
                .then((user)=>{
                    req.flash('success_msg','u r registered now login');
                    res.redirect('/login');})
                .catch(err=>console.log("LOGIN ERROR"));
            } )
        });
    }
});
module.exports=app;