const express = require("express");
const {userInfoModel, userModel} = require('./models/user');
const mongoose = require('mongoose');
mongoose.connect("mongodb://localhost:27017/userr").then(() => console.log("connected"));

const app = express();
app.use(express.json());

app.listen(3000, () => console.log("Listening on port 3000"));


app.post("/", async (req, res) => {
    try{
        let user = new userModel(req.body);
        console.log(user);
        await user.validate();
        try{
            const userInfo = new userInfoModel(req.body);
            await userInfo.save();
            try{
                user["userInfoId"] = userInfo._id;
                console.log(user);
                await user.populate("userInfoId");
                console.log(user);
                await user.save();
                console.log(user);
                res.send(user);
                
            }catch(err){
                console.log(err.message);
                res.send("Could not create user ...");
            }
        }catch(err){
            console.log(err.message);
            res.send("Can't create user....");
        }
    }catch(err){
        console.log(err.message);
        res.send("User already exists....");
    }
});

app.post("/sign-in", async (req, res) => {
    try{
        // const user = await userModel.where(req.body).populate('userInfoId');
        // await user[0].populate("userInfoId");
        const user = await userModel.find(req.body).populate('userInfoId');
        console.log(user[0]);
        res.send(`Name: ${user[0].userInfoId.name} and age is ${user[0].userInfoId.age}`);
    }catch(err){
        console.log(err.message);
        res.send("Wrong userName or password");
    }
});


app.get("/", async (req, res) => {
    try{
        const users = await userModel.find({});
        for(user of users){
            await user.populate('userInfoId');
            res.write(`Name: ${user.userInfoId.name} and age is ${user.userInfoId.age} \n`)
        }
        res.end();
    }catch(err){
        console.log(err.message);
        res.send("Could not fetch data");
    }
});

app.patch("/", async(req, res) => {
   try{
        const users = await userModel.where(req.body).select("userInfoId");
        console.log(users[0]);
        delete req.body.password;
        delete req.body.userName;
        try{
            // const userInfo = await userInfoModel.where("_id").equals(users[0].userInfoId);
            // console.log(userInfo);
            // for(key of Object.keys(req.body)){
            //     console.log(1);
            //     userInfo[0][key] = req.body[key];
               
            // }
            // await userInfo[0].save();
            // console.log(userInfo[0]);
            // res.send(userInfo[0]);


            const userInfo = await userInfoModel.updateOne({"_id": users[0].userInfoId}, {$set: req.body});
            console.log(userInfo);
            res.send("Done");
        }catch(err){
            console.log(err.message);
            res.send("Could not update");
        }
        
   }catch(err){
       console.log(err.message);
       res.send("No user found with given userName");
   }
});

app.delete("/", async (req, res) => {
    try{
        // const result = await userModel.deleteOne(req.body);
        // console.log(result);
        // res.send("Done");
        const result = await userModel.where(req.body).limit(1);
        console.log(result);
        await result[0].delete();
        res.send("Done");
    }catch(err){
        console.log(err.message);
        res.send("Could not delete");
    }
})