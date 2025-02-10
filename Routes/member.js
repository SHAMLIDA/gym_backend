const express = require('express')
const router=express.Router()
const membercontroller=require('../Controllers/member')
const auth=require('../Auth/auth')

router.get('/all-member',membercontroller.getallmember)

module.exports=router;