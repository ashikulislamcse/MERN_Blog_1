import express from 'express'
import Blog from '../Models/BlogModel.js';
import Comment from '../Models/CommentModel.js';
import VerifyToken from '../MiddleWare/VarifyedToken.js';
import isAdmin from '../MiddleWare/isAdmin.js';


const router = express.Router();

//Create a Blog Post
router.post('/create-post',VerifyToken, isAdmin, async(req, res)=>{
    try {
        //console.log("Blog Data from Api: ", req.body);
        const newPost = new Blog({...req.body, author: req.userId});
        await newPost.save();
        res.status(201).send({
            message:"Post Created Successfully..", 
            post:newPost
        })
    } catch (error) {
        console.error('Error Creating Post', error);
        res.status(500).send({message:'Error creating Post'})
    }
});


//Get All Blogs
router.get('/', async(req, res)=>{
    try {
        const {search, category, location} = req.query;

        let query={};
        if(search){
            query ={
                ...query,
                $or:[
                    {title:{$regex:search, $options:"i"}},
                    {content:{$regex:search, $options:"i"}}
                ]
            }
        }

        if(category){
            query ={
                ...query,
                category: category
            }
        }

        if(location){
            query ={
                ...query,
                location: location
            }
        }
        const post = await Blog.find(query).populate('author', 'email').sort({createdAt: -1});
        res.status(200).send({
            message: "All post Get Successfully.",
            post: post
        });
    } catch (error) {
        console.error('Error Get All Post', error);
        res.status(500).send({message:'Error Get All Post'})
    }
});

//Get Single Blog
router.get('/:id', async(req, res)=>{
    try {
        //console.log(req.params.id)
        const postId = req.params.id;
        const post = await Blog.findById(postId);
        if(!post){
            return res.status(404).send({
                message:"Post Not Found"
            });
        };
        //Comment Show Here for Single Post
        const comment = await Comment.find({postId:postId}).populate('user', "username email")
        res.status(200).send({
            message:"Post get successfully.",
            post: post
        });
    } catch (error) {
        console.error('Error Get Single Post', error);
        res.status(500).send({message:'Error Get Single Post'});
    }
});

//Update a Blog Post

router.patch('/update-post/:id',VerifyToken, async(req, res)=>{
    try {
        const postId = req.params.id;
        const updatePost = await Blog.findByIdAndUpdate(postId, {
            ...req.body
        }, {new:true});

        if(!updatePost){
            return res.status(404).send({
                message:"Post not Found"
            });
        }

        res.status(200).send({
            message:"Post Updated Successfully.",
            post: updatePost
        });

    } catch (error) {
        console.error('Error Updating Post', error);
        res.status(500).send({message:'Error Updating Post'})
    }
});

//Delete a blog Post
router.delete('/:id',VerifyToken, async(req, res)=>{
    try {
        const postId = req.params.id;
        const post = await Blog.findByIdAndDelete(postId);
        if(!post){
            return res.status(404).send({
                message:"Post Not found"
            });
        };

        //Delete Related Comments
        await Comment.deleteMany({postId:postId})
        res.status(200).send({
            message:"Post deleted Successfully.",
            post: post
        });

    } catch (error) {
        console.error('Error Deleting Post', error);
        res.status(500).send({message:'Error Deleting Post'})
    }
});

//Related Blog Post
router.get('/related/:id', async (req, res)=>{
    try {
        const {id} = req.params;
        if(!id){
            return res.status(400).send({
                message:"Post id is required"
            });
        };
        const blog =  await Blog.findById(id);
        if(!blog){
            return res.status(404).send({
                message:"Post is not Found"
            });
        };

        const titleRegex = new RegExp(blog.title.split(" ").join("|"), 'i');

        const relatedQuery = {
            _id :{$ne: id}, //exclude the current blog by id
            title:{$regex: titleRegex}
        }

        const relatedPost  = await Blog.find(relatedQuery);

        res.status(200).send({
            message: "Related post found!",
            post: relatedPost
        })

    } catch (error) {
        console.error('Error Get Related Post', error);
        res.status(500).send({message:'Error Get Related Post'})
    }
})


export default router;