const jwt = require('jsonwebtoken');
const key = process.env.JWT_SECRET_KEY

// Middleware
function verifyToken(req, res,next) {
    if(req.headers.authorization!==undefined){
        let token = req.headers.authorization.split(" ")[1];
        jwt.verify(token,key,(err,data)=>{
            if(!err){
                next()
            }else{
                res.status(403).send("Invalid Token")
            }
        })
        
    }else{
        res.send({message:"Please send a token"})
    }
}

module.exports = verifyToken