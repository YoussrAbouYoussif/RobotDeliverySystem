const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Create the schema
const Request = new Schema({
    sender:{
        type:Schema.Types.ObjectId, ref : "User",
        required:true
    },
    receiver:{
        type:Schema.Types.ObjectId, ref : "User",
        required:true
    },state:{
        type:String,enum: ['Pending','Waiting','In Progress', 'Done' , 'Rejected'],
        required:true,
        default:'Waiting'
    },
    route:{
        type:Schema.Types.ObjectId,ref:"Route",
        required:false
    },
    time:{
        type:Date,
        required:true,
        default: Date()
    },
    processed:{
        type:String,enum: ['Yes','No'],
        required:true,
        default:"No"
    }
})

module.exports = mongoose.model('requests', Request)