const express=require("express")
const { verifysignup, verifylogin, verifytoken, verifyrefreshtoken, blacklistlogout } = require("../middlewares/middleware")
const jwt=require("jsonwebtoken")
const cookie=require("cookie-parser")
const { blacklist } = require("../models/model")
require("dotenv").config()
const route=express.Router()
route.use(cookie())
const authorization=(role)=>{
    return (req,res,next)=>{
        if(req.user.role===role){
            next()
        }else{
            res.status(401).json({msg:"UnAuthorized"})
        }
    }
}
route.post("/signup",verifysignup,async(req,res)=>{
    res.json("registered")
})
route.post("/login",verifylogin,async(req,res)=>{
    let token=jwt.sign(req.body,process.env.secret,{expiresIn:"1m"})
    let refreshtoken=jwt.sign(req.body,process.env.refreshsecret,{expiresIn:"5m"})
    res.cookie("Token",token)
    res.cookie("RefreshToken",refreshtoken)
    console.log(req.cookies);
    res.json({token,refreshtoken})
})
route.get("/logout",async(req,res)=>{
    const token=req.cookies.Token
    const refreshtoken=req.cookies.RefreshToken
    let arr=[]
    arr.push(token)
    arr.push(refreshtoken)
    let data=await blacklist.findByIdAndUpdate("640efc7aa44c8b1a1bd7b107",{arr})
    res.json("token and refresh token is blacklisted")
})
route.post("/products",verifytoken,authorization("user"),async(req,res)=>{
    res.json({msg:"products"})
})
route.post("/addproducts",verifytoken,authorization("seller"),async(req,res)=>{
    res.json({msg:"add products"})
})
route.post("/deleteproducts",verifytoken,authorization("seller"),async(req,res)=>{
    res.json({msg:"delete products"})
})
route.post("/refreshtoken",verifyrefreshtoken,async(req,res)=>{
    let token=jwt.sign(req.body,process.env.secret,{expiresIn:"1h"})
    res.json({token})
})

module.exports={
    route
}
