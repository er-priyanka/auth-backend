const express = require('express');
const {RegisterModel} = require('../Models/auth.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userRoute = express.Router();

// register route
userRoute.post('/signup', async(req, res) => {
    const {name, avatar, bio, phone, email, password}= req.body;

    try{
        bcrypt.hash(password, 8, async(err, hash)=>{
            const user = new RegisterModel({
                name,
                avatar,
                bio,
                phone,
                email,
                password:hash
            });

            await user.save();
            res.status(201).send("Registered successfully!");
        });
    }catch(err){
        res.status(401).send(err.message);
    }
});

//login route
userRoute.post("/signin", async(req, res) =>{
    const {email, password} = req.body;

    try{
        const user = await RegisterModel.find({email});

        if(user.length > 0){
            bcrypt.compare(password, user[0].password, function (err, result){
                if(result){
                    const token = jwt.sign({userID:user[0]._id}, "masai");

                    res.send({
                        msg:"Login Success",
                        token:token,
                        name:user[0].name,
                        email:user[0].email
                    });
                } else {
                    res.send({msg:"Wrong Password!"});
                }
            })
        }else{
            res.send({msg:"Wrong credentials!"});
        }
    } catch(err){
        res.send(err.message);
    }
});


//get all profile details
userRoute.get("/profiledetails", async(req, res) => {
    const token = req.headers.authorization;

    if(token){
        const decoded = jwt.verify(token, "masai");

        if(decoded){
            const userID = decoded.userID;

            const user = await RegisterModel.findOne({_id:userID});

            // console.log(decoded);
            // console.log(user);
            res.send(user);
            // res.json({user});
        }else{
            res.send("Invalid token!");
        }
    }else{
        res.send("Please login!");
    }
});

// user can edit his profile
userRoute.patch("/editprofile", async(req, res) => {
    const data = req.body;
    const password = data.password;
    const token = req.headers.authorization;

    if(token){
        const decoded = jwt.verify(token, "masai");

        if(decoded){
            const userID = decoded.userID;

            if(password){
                bcrypt.hash(password, 8, async(err, hash)=>{
                
                    const user = await RegisterModel.findOneAndUpdate({_id:userID}, {...data, password:hash});
    
                });
            }else{
                const user = await RegisterModel.findOneAndUpdate({_id:userID}, data);
    
            }

            res.status(201).send("Updated successfully!");

            


            // console.log(decoded);
            // console.log(user);
            // res.send(user);
            // res.json({user});
        }else{
            res.send("Invalid token!");
        }
    }else{
        res.send("Please login!");
    }
    
});




module.exports = {
    userRoute
}