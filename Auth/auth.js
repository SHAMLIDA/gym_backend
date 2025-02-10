const gym=require('../Modals/gym')
const jwt=require('jsonwebtoken')

const auth = async(req,res,next)=>{
    try {
        const token=req.cookies.cookie_token;
        if(!token){
            return res.status(401).json({error:"You are not logged in"})
        }
        const decoded=jwt.verify(token,process.env.SECRET_KEY);
        req.gym=await gym.findById(decoded.id).select('-password')
        next()
    } catch (error) {
         console.error("Auth Error:", error.message);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }

}
module.exports=auth