const mongoose=require('mongoose')
const connectionstring=process.env.CONNECTION_STRING
mongoose.connect(connectionstring).then(res=>{
    console.log("monodb db atlad connected to your pfserver ");
    
}).catch(err=>{
    console.log("connection failed");
    console.log(err);
    
    
})