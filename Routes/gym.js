const express = require('express')
const router=express.Router()
const gymcontroller=require('../Controllers/gym')
const auth=require('../Auth/auth')
router.post('/register',gymcontroller.register)
router.post('/login',gymcontroller.login)
router.post('/rest-pswrd/otp', gymcontroller.sendOtp); 
 router.post('/rest-pswrd/chkotp', gymcontroller.checkotp); 
 router.post('/rest-pswrd', gymcontroller.resetpassword); 
 router.post('/logut',gymcontroller.logout)




module.exports=router;