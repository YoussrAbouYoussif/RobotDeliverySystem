const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Create the schema
const Route = new Schema({
    start:{
        type:JSON,
        required:true
    },
    end:{
        type:JSON,
        required:true
    },
    path:{
        type:JSON,
        required:true
    }
})

module.exports = mongoose.model('routes', Route)