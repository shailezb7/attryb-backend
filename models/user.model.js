let mongoose=require("mongoose");

let userschema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    User:{
        type:String,
        required:true,
        enum:["Buyer","Seller"]
    }
})

let Usermodel=mongoose.model("user",userschema);

module.exports={
    Usermodel
}