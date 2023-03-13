const bcrypt = require("bcrypt")
require("dotenv").config()
const jwt = require("jsonwebtoken")
const { model, blacklist } = require("../models/model")
const { route } = require("../routes/routes")


const verifysignup = async (req, res, next) => {
    let { email, password, role } = req.body
    console.log(email, password)
    let user = await model.findOne({ email })
    if (user == null) {
        let hash = bcrypt.hashSync(password, 5)
        let data = {
            email,
            password: hash,
            role
        }
        let user = new model(data)
        await user.save()
        next()
    } else {
        res.json("Already exits")
    }

}
const verifylogin = async (req, res, next) => {
    let { email, password } = req.body
    console.log(email, password)
    let user = await model.findOne({ email })
    if (user != null) {
        bcrypt.compare(password, user.password, (err, decode) => {
            if (err) {
                res.json(err);
            } else if (decode) {
                req.user = user
                next()
            } else {
                res.json("wrong password")
            }
        })
    } else {
        res.json("user not found")
    }
}
const verifytoken = async (req, res, next) => {
    let token = req.headers.authorization.split(" ")[1]
    let temp = false
    let data = await blacklist.findById("640efc7aa44c8b1a1bd7b107")
    //checking blacklist
    if (!data.arr.includes(token)) {
        jwt.verify(token, process.env.secret, (err, decode) => {
            if (err) res.json({ "msg": "token expired" })
            else if (decode) {
                temp = decode
            }
        })
        if (temp != false) {
            let user = await model.findOne({ email: temp.email })
            req.user = user
            next()
        }
    }else{
        res.json({msg:"token expired"})
    }


}
const verifyrefreshtoken = async (req, res, next) => {
    let refreshtoken = req.headers.authorization.split(" ")[1]
    let data = await blacklist.findById("640efc7aa44c8b1a1bd7b107")
    //checking blacklist
    if(!data.arr.includes(refreshtoken)){
        jwt.verify(refreshtoken, process.env.refreshsecret, (err, decode) => {
            if (err) res.json({ "msg": "token expired" })
            else if (decode) {
                next()
            }
        })
    }else{
        res.json({msg:"refresh token expired"})
    }
}

module.exports = {
    verifysignup,
    verifylogin,
    verifytoken,
    verifyrefreshtoken
}