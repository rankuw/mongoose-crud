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
        unique: true
    },
    password: {
        type: String
    },
    userInfoId: {
        type: mongoose.Types.ObjectId,
        ref: mongoose.models.userInfo
    }
});


const userModel = mongoose.model('user', userSchema);

// userSchema.path('userName').validate(async (name) => { //this will be executed during validate().
//     // const cnt = await mongoose.models.userModel.countDocuments({userName: name});
//     const cnt = await mongoose.models.user.countDocuments({userName: name}); //will return number of documents found.
//     return !cnt;
// })

module.exports = {userInfoModel, userModel};