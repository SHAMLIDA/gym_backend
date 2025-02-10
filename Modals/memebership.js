const mongoose= require('mongoose')

const Membership = mongoose.Schema({
    months:{
        type:Number,
        required:true,
    },
    price:{
        type:Number,
        required:true,
    },
    gym:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'gym',
        required:true
    },
})

module.exports=mongoose.model('membership', Membership)