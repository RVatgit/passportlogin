const mong = require("mongoose");
const schema =mong.Schema({
    name:{
        type:String,
        required:true,
    },
    date:{
        type:Date,
        default:Date.now(),
    },
    email:{
        type:String,
        required:true,
    },
    psd:{
        type:String,
        required:true,
    }
});

module.exports=mong.model("user2",schema);