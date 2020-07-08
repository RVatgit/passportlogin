const exp=require('express');
const app= exp.Router();


app.get('/',(req,res)=>{
    res.render ('index');
});
module.exports=app;
