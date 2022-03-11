const res = require("express/lib/response");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userInfoSchema = new Schema({
    name: {
        type: String
    },
    age: {
        type: Number
    }
});
const userInfoModel = mongoose.model('userInfo', userInfoSchema);
const userSchema = new Schema({
    userName: {
        type: String,
        required: true,
        unique: true //this won't work if we already have duplicate data in our database.
    },
    password: {
        type: String
    },
    userInfoId: {
        type: mongoose.Types.ObjectId,
        ref: mongoose.models.userInfo
    }
});

userSchema.pre('remove', { query: true, document: true }, async function (next) {
    try{
        console.log("Removing...");
        console.log(this);
        const result = await mongoose.models.userInfo.deleteOne({_id: this.userInfoId});
        next();
    }catch(err){
        console.log(err.message + " tf");
    }
});

const userModel = mongoose.model('user', userSchema);

// userSchema.path('userName').validate(async (name) => { //this will be executed during validate().
//     // const cnt = await mongoose.models.userModel.countDocuments({userName: name});
//     const cnt = await mongoose.models.user.countDocuments({userName: name}); //will return number of documents found.
//     return !cnt;
// })

module.exports = {userInfoModel, userModel};