const { type } = require('express/lib/response');
const mongoose = require('mongoose');

const memberSchema=mongoose.Schema({

     name:{
         type:String,
         required:true
     },
     mobile:{
         type:String,
        
     },
     address:{
         type:String,
        
     },
     membership:{
         type:mongoose.Schema.Types.ObjectId,
         ref:'membership',
         required:true
     },
     gym:{
         type:mongoose.Schema.Types.ObjectId,
         ref:'gym',
         required:true
     },
     profilepic:{
         type:String,
         required:true
     },
     status:{
        type:String,
        default:'Active'
     },
     lastpayment:{
         type:Date,
         default:new Date(),
     },
     nextbilldate:{
         type:Date,
         default:new Date(),
     }


})

module.exports=mongoose.model('member',memberSchema)