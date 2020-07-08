const exp=require('express');
const app= exp.Router();
const passport=require('passport');

app.get('/',(req,res)=>{
    res.render('login');
});
app.post('/',(req,res,next)=>{
    passport.authenticate('local',{
        successRedirect:'/user',
        failureRedirect:'/login',
        failureFlash:true
    })(req,res,next);
});
module.exports=app;