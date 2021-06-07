const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Create the schema
const Office = new Schema({
    officeNumber:{
        type:String,
        required:true
    },
   point:{
    type:JSON,
    required:true
   },
   pointEnd:{
    type:JSON,
    requireed:true   
   }
})

module.exports = mongoose.model('offices', Office)