// require('dotenv').config();
let mongoose=require('mongoose');

let connection=async ()=>{
    try {
        await mongoose.connect(process.env.MONGO_DB);
        console.log('connected to atlas');
    } catch (error) {
        console.log('error while connecting to mongo DB');
    }
}

 module.exports = {connection}