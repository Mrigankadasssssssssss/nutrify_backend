const express = require('express');
const  mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const userModel = require ('./models/userModel');
const foodModel = require('./models/foodModel');
const verifyToken = require('./verifyToken');
const trackingModel = require('./models/trackingModel');



mongoose.connect("mongodb://localhost:27017/Nutrify").then(()=>{
    console.log("Database connected")
}).catch((err)=>{
    console.log(err);
})



const app = express();

const PORT = process.env.PORT ||3000;

app.use(express.json());
app.get('/',(req,res)=>{
    res.send('Nutrify')
})
// Register
app.post('/register',(req,res)=>{
    let user = req.body;
    bcrypt.genSalt(10,(err,salt)=>{
        if(!err){
            bcrypt.hash(user.password,salt,async(err,hpass)=>{
                if(!err){
                    user.password = hpass;
                    try {
                        let response = await userModel.create(user)
                        res.status(201).send({message:"User created successfully"})
                    } catch (error) {
                        console.log(error);
                        res.status(500).send({message:"Some Error occurred!!!"})
                    }
                }
            })
        }
    })
    
})
// Login
const key = process.env.JWT_SECRET_KEY

app.post('/login',async(req,res)=>{
    let userCred = req.body;
    try {
        let user = await userModel.findOne({email: userCred.email});
        if(user!=null){
            bcrypt.compare(userCred.password,user.password,(err,success)=>{
                if(success){
                    jwt.sign({email:userCred.email},key,(err,token)=>{
                        if(!err){
                            res.send({message:"Login successful",token:token})
                        }
                    })
                }else{
                    res.status(403).send({message:"Incorrect password"});
                }
            })
        }else{
            res.status(404).send({message:"User not found"})
        }

    } catch (error) {
        console.log(error);
        res.status(500).send({message:"Can not find user"});
    }
    
})
// to see all foods
app.get('/foods',verifyToken,async(req,res)=>{
    try {
        
        let foods = await foodModel.find()
        res.send(foods)
    } catch (error) {
        console.log(error);
        res.status(500).send("Some problem while fetching items")
    }
})


// to fetch a food by name
app.get('/foods/:name',verifyToken,  async function(req,res){
    try{

        let foods = await foodModel.find({name:{$regex:req.params.name,$options:"i"}})
        if (foods.length!== 0 ){

            res.send(foods)
        }else{
            res.status(500).send("Food Items Not Found")    

        }
    }catch(e){
        console.log(e);
        res.status(500).send("Some problem while fetching items")    
    }
})


// tracking data:
app.post('/track',verifyToken,async(req, res) => {
    let trackedFood = req.body;
    try {
        let data = await trackingModel.create(trackedFood)
        res.status(200).send({messege:"food is added"})
    } catch (error) {
        console.log(error);
        res.status(500).send({Message:"Some problem in getting food"})
    }
})

// fetch all food items consume by a user:
app.get('/track/:userid',verifyToken,async(req,res)=>{
    try {
        let  users = await trackingModel.find({user_id: req.params.userid}).populate('food_id')
        if (users.length!== 0 ){

            res.send(users)
        }else{
            res.status(500).send("User Not Found")    

        }
    } catch (error) {
        console.log(error);
        res.status(500).send("Some problem while fetching users")    
    }
})



app.listen(PORT,()=>{
    console.log(`Listening on the port ${PORT}`);
});