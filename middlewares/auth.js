let jwt = require('jsonwebtoken');

let auth=async(req,res,next)=>{
    let token=req.headers?.authorization.split(" ")[1];
    console.log(token);
    if(token){
        var decoded = jwt.verify(token, process.env.SECRET_KEY);
        if(decoded){
           req.userID = decoded.userID;
           next();
        }
        else{
            res.send({msg:"invalid token"});
        }
    }
    else{
        res.send({msg:'please insert token !'})     
    }
}

module.exports={auth};