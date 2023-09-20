require('dotenv').config();
let express=require('express');
let cors=require('cors');
let {connection}=require('./config/db.js')
let bcrypt=require('bcrypt');
let {Usermodel} = require('./models/user.model.js');
let {Carmodel} = require('./models/car.model.js');
let jwt=require('jsonwebtoken');
const { auth } = require('./middlewares/auth.js');
let app=express();

app.use(express.json());
app.use(cors());


app.get('/',(req,res)=>{
    res.send({msg:'working'});
})

app.post("/signup",async(req,res)=>{

    let {name,email,password,User}=req.body
    let user=await Usermodel.findOne({email})
if(user){
    res.send({msg:"User Exist ! Please Login "})
}   else{
    try{
        let hash=bcrypt.hashSync(password,4);
await Usermodel.create({name,email,password:hash,User})
res.send({msg:"User sign up success"})        
    }catch(err){
        res.send({msg:"Error during Signup"})
    }
}
})

app.post("/login",async(req,res)=>{
let {email,password}=req.body;
let user=await Usermodel.findOne({email});
if(user){
try{
let userpass=user.password;
let match=bcrypt.compareSync(password,userpass);
if(match){
    let token=jwt.sign({userID:user._id},process.env.SECRET_KEY);
    res.send({msg:"login success",token,userName:user.name})
}else{
    res.send({msg:"Invalid Credentials"})
}
}catch(err){
    res.send({msg:"Login Failed"})
}
}else{
    res.send({msg:"Please Signup first"});
}
})


app.post('/cars/create' , auth,async (req,res)=>{
    let {name,imageUrl,description,price,color,mileage} = req.body;
    let user= await Usermodel.findOne({_id:req.userID})
    if(user){
        await Carmodel.create({name,imageUrl,description,price,color,mileage,userID:req.userID});
        res.send({msg:`post created by ${user.name}`});
    }
    else{
       res.send({msg:'wrong token'});
    }
 })

 app.get('/cars' , async(req,res)=>{
    let info = await Carmodel.find();
    res.send({data:info});
 })

 app.get('/cars/:id', async (req, res) => {
    try {
      const carId = req.params.id;
      // Assuming you have a database model named 'Postmod' for posts
      const car = await Carmodel.findById(carId);
      
      if (!car) {
        return res.status(404).json({ error: 'Car not found' });
      }
  
      res.json({ data: car });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
    }
  });

  app.post('/check', auth, async (req,res)=>{
      let {userID} = req;
      console.log(userID)
      let userType = await Usermodel.findById({_id:userID});
    //   console.log(userID);
        res.send({type:userType.User})
  })
  

  app.put('/update/:id', async (req, res) => {
    const { id } = req.params; // Get the ID from the URL parameter
    const { desc, price, color, mileage } = req.body;
  
    try {
      // Update the document with the specified ID
      const updatedCar = await Carmodel.findByIdAndUpdate(
        id, // Pass the ID to findByIdAndUpdate
        {
          description: desc,
          price: price,
          color: color,
          mileage: mileage,
        },
        { new: true } // Set { new: true } to return the updated document
      );
  
      if (!updatedCar) {
        return res.status(404).json({ msg: 'Car not found' });
      }
  
      res.json({ msg: 'Car updated successfully', updatedCar });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ msg: 'Internal server error' });
    }
  });
  



app.listen(process.env.PORT,()=>{
    connection();
    console.log(`Connected on ${process.env.PORT}`);
})