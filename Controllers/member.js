const Member=require('../Modals/member')

exports.getallmember= async(req,res)=>{
     try {
        const {skip,limit}=req.query;
        const members=await Member.find({gym:req.gym._id})
        const totalmember=members.length
        const limitedmember=await Member.find({gym:req.gym._id}).sort({createdAt:-1})
        .skip(skip).limit(limit);
         res.status(200).json({
            message:members.length?"fetched members successfully":"no any members registered yet",
            members:limitedmember,
            totalMembers:totalmember,
         })

     } catch (error) {
         res.status(500).json({error:error.message})
     }
}