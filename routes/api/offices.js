const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Office = require('../../models/Office')

//Get All Offices
router.get('/', async (req,res) => {
    const offices = await Office.find()
    res.json({data: offices})
})

//Create a new Office with it's corresponding co-ordinates
router.post('/', async (req,res) => {
    try {
        // console.log(req.body)
        const newOffice = await Office.create(req.body)
     res.json({msg:'Office was created successfully', data: newOffice})
    }
    catch(error) { 
        console.log(error)
    }  
 })



 //Update the co-ordinates of the office
 router.put('/:id', async (req,res) => {
    try {
   //   const id = req.params.id
     const office = await Office.findById(req.params.id)
     if(!office) return res.status(404).send({error: 'Office does not exist'})
     const updatedOffice = await Office.findByIdAndUpdate({_id : req.params.id},req.body)
     res.json({msg: 'Office updated successfully'})
    }
    catch(error) {

        console.log(error)
    }  
 })

 //Delete specific office with it's corresponding co-ordinates
 router.delete('/:id', async (req,res) => {
    try {
     const id = req.params.id
     const deletedOffice = await Office.findByIdAndRemove(id)
     res.json({msg:'Office was deleted successfully', data: deletedOffice})
    }
    catch(error) {

        console.log(error)
    }  
 })
module.exports=router
