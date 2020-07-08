const exp=require('express');
const app= exp.Router();
const {ensureAuthenticated} =require('../config/auth');

app.get('/',ensureAuthenticated,(req,res)=>{
    res.render('dashboard',{
        name:req.user.name
    })
});
app.get('/logout',(req,res)=>{
    req.logout();
    req.flash('success_msg',"You hvae logge d out");
    res.redirect('/login'); 
});
module.exports=app;