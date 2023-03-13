const mongoose=require("mongoose")
require("dotenv").config()
const connection=mongoose.connect(process.env.mongourl)
const schema=mongoose.Schema({
    email:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
    role:{
        type:String,
        required:true,
        default:"user",
        enum:["seller","user"]
    },

},{
    versionKey:false
})
const blacklisting=mongoose.Schema({},{
    strict:false
})
const model=mongoose.model("users",schema)
const blacklist=mongoose.model("blacklist",blacklisting)
module.exports={
    connection,
    model,
    blacklist
}