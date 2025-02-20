import jwt from 'jsonwebtoken'
const JWT_SECRET = process.env.JWT_SECRET_KEY


const VerifyToken = async(req, res, next)=>{
    try {
        const token  = req.headers.authrization?.split(' ')[1];
        if(!token){
            res.status(401).send({
                message:"No token Provided"
            });
        };
        const decoded = jwt.verify(token, JWT_SECRET);
        if(!decoded.userId){
            res.status(401).send({
                message:"invalid token provided"
            });
        };
        req.userId = decoded.userId;
        req.role = decoded.role;
        next();

    } catch (error) {
        console.log("Error veryfy token", error);
        res.status(404).send({message:'Invalid Token'});
    }
}

export default VerifyToken;