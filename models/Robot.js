const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Create the schema
const Robot = new Schema({
    current_location:{
        type:JSON,
        required:true
    },
    processed:{
        type:String,enum: ['idle','busy'],
        required:true,
        default:"idle"
    }
})

module.exports = mongoose.model('robots', Robot)