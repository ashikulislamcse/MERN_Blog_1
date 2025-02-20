import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const UserSchema = new mongoose.Schema({
    username:{
        type:String, 
        required:true,
        unique:true
    },
    email:{
        type:String, 
        required:true,
        unique:true
    },
    password:{
        type:String, 
        required:true,
    },
    role:{
        type:String,
        default:"user"
    },
    createdAt:{
        type:Date,
        default: Date.now
    }
});


//Hash Password Before Saving database
UserSchema.pre('save', async function(next){
    const user = this;
    if(!user.isModified('password')) return next();
    const hashPassword = await bcrypt.hash(user.password, 10);
    user.password = hashPassword
    next();
});

//Compare Password when user try Login
UserSchema.methods.comparePassword = function(givenPasswod){
    return bcrypt.compare(givenPasswod, this.password)
}

const User = mongoose.model('User', UserSchema);
export default User;