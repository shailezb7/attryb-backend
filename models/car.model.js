let mongoose=require("mongoose");

let carschema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    imageUrl:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    color:{
        type:String,
        required:true
    },
    mileage:{
        type:Number,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    userID:{
        type:String, 
    }
})

let Carmodel=mongoose.model("car",carschema);

module.exports={
    Carmodel
}