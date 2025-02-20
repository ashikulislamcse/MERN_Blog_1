import express from 'express'
import Comment from '../Models/CommentModel.js';

const router = express.Router();

//Create a Comment
router.post('/post-comments', async(req, res)=>{
    //console.log(req.body)
    try {
        const newComment = new Comment(req.body);
        await newComment.save();
        res.status(200).send({
            message:"Comment Post Successfully..",
            post: newComment
        });
    } catch (error) {
        console.error('Error Comment post', error);
        res.status(500).send({message:'Error Comment post'})
    }
});

//Get All Comments
router.get('/total-comments', async(req, res)=>{
    try {
        const totalComments = await Comment.countDocuments({});
        res.status(200).send({
            message:"Total Comment Count",
            total: totalComments
        })
    } catch (error) {
        console.error('Error Get Total Comments', error);
        res.status(500).send({message:'Error Get Total Comments'});
    }
})

export default router;