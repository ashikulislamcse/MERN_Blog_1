
const isAdmin = async(req, res, next)=>{
    if(req.role !== 'admin'){
        return res.status(403).send({
            success: false,
            message:'you are not Admin..!'
        });
    };
    next();
};

export default isAdmin;