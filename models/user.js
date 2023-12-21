const mongoose = require("mongoose");
const bcryptjs= require("bcryptjs");
const jwt = require("jsonwebtoken")
const ScrectKey = "mynameisromanbaloch"
const UserSchema = new mongoose.Schema({
    fullname:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
        unique:true
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }]
})
//Middleware for password hashing
UserSchema.pre("save",async function (next){
    if(this.isModified('password')){
        this.password = await bcryptjs.hash(this.password,10)
        next();
    }
})
//Middleware for generating tokens
UserSchema.methods.generateToken =async function (user){
    const payload = {
        _id:user._id,
        email:user.email,
        fullname:user.fullname
    }
    const token = jwt.sign(payload,ScrectKey)
    this.tokens = this.tokens.concat({token:token})
    await this.save();
    return token;
}  
const User = mongoose.model("User",UserSchema);
module.exports = User;