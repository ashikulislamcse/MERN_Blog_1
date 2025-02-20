import express from 'express'
import User from '../Models/UserModel.js'
import GenerateToken from '../MiddleWare/GenerateToken.js';


const router = express.Router();

//Register a new User
router.post('/register', async(req, res)=>{
    try {
        const {email, password, username } = req.body;
        const user = new User({email, password, username});
        
        await user.save();

        res.status(200).send({
            message:"User Registerd Successfully.",
            user: user
        })
    } catch (error) {
        console.error('failed to register', error);
        return res.status(500).json({ success: false, message:'Registration Failed!'});
    }
});

//login a User
router.post('/login', async(req, res)=>{
    try {
        const {email, password} = req.body;

        const user = await User.findOne({email});
        if(!user){
            return res.status(404).send({
                message:"User not Found!"
            });
        };

        const isMatch = await user.comparePassword(password);
        if(!isMatch){
            return res.status(404).send({
                message:"Password is Wrong!"
            });
        }

        //generate a token
        const token = await GenerateToken(user._id)
        res.cookie("token", token, {
            httpOnly:true,
            secure:true,
            sameSite:true
        });

        res.status(200).send({
            message:"Login Successfull..",
            token,
            user:{
                _id: user._id,
                email: user.email,
                username: user.username,
                role:user.role
            }
        });

    } catch (error) {
        console.error('failed to Login', error);
        return res.status(500).json({ success: false, message:'Login Failed!'});
    }
});

//Logout a User
router.post('/logout', async(req, res)=>{
    try {
       res.clearCookie("token");
       res.status(200).send({
        message:"Logout Successfull.."
       });
    } catch (error) {
        console.error('failed to Logout', error);
        return res.status(500).json({ success: false, message:'Logout Failed!'});
    }
});


//Get All Users
router.get('/users', async(req, res)=>{
    try {
        const users = await User.find({}, "id email role");
        res.status(200).send({
            message:"All Users Get Successfully..!",
            users 
        })
    } catch (error) {
        console.error('failed to Get All Users', error);
        return res.status(500).json({ success: false, message:'Get All Users Failed!'});
    }
});

//delete a user
router.delete('/users/:id', async(req, res)=>{
    try {
        const {id} = req.params;
        const user = await User.findByIdAndDelete(id);
        if(!user){
            return res.status(404).send({
                message:"User Not Found"
            });
        }
        res.status(200).send({
            message:"User Delated Successfully..!"
        });
    } catch (error) {
        console.error('failed to Delete User', error);
        return res.status(500).json({ success: false, message:'failed to Delete User!'});
    }
});

//Update a User Role
router.patch('/users/:id', async(req, res)=>{
    try {
        const {id} = req.params;
        const {role} = req.body;
        const user = await User.findByIdAndUpdate(id, {role}, {new:true});
        if(!user){
            res.status(404).send({
                message:"User Not Found"
            });
        };
        res.status(200).send({
            message:"User Updated Successfully..!",
            user
        });

    } catch (error) {
        console.error('failed to Update User role', error);
        return res.status(500).json({ success: false, message:'failed to Update User role!'});
    }
})

export default router;