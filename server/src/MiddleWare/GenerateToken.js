import jwt from 'jsonwebtoken'
import User from '../Models/UserModel.js';
const JWT_SECRET = process.env.JWT_SECRET_KEY
const GenerateToken = async(userId)=>{
    try {
        const user = await User.findById(userId);
        if(!user){
            throw new error('User not Found!')
        };
        const token = jwt.sign({userId: user._id, role: user.role},JWT_SECRET, { expiresIn: '1h' });
        return token;
    } catch (error) {
        console.log("Error Generating Token", error);
        throw error;
    }
}

export default GenerateToken;