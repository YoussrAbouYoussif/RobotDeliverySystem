const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')

const Robot = require('../../models/Robot')

router.get('/', async (req,res) => {
    const robots = await Robot.find()
    res.json({data: robots})
})

router.get("/:id", async (req, res) => {
    const id = req.params.id;
      if (id.match(/^[0-9a-fA-F]{24}$/)) {
        const u = await Robot.findById(id);
        if(u)
          return res.json({ data: u });
        else
          return res.send({ msg: "Robot is not found" });
      }
      else 
       return res.send({ error: "not valid Robot id" });
    }
  );


router.post('/', async (req,res) => {
    try {
        // console.log(req.body)
        const newRobot = await Robot.create(req.body)
    //  console.log(newRobot)
     res.json({msg:'Robot was created successfully', data: newRobot})
    }
    catch(error) {
        // We will be handling the error later
        console.log(error)
    }  
 })
 
 // Update a robot -- They can update the current location of the robot from here
 router.put('/:id', async (req,res) => {
     try {
    //   const id = req.params.id
      const robot = await Robot.findById(req.params.id)
      if(!robot) return res.status(404).send({error: 'Robot does not exist'})
      const updatedRobot = await Robot.findByIdAndUpdate({_id : req.params.id},req.body)
      res.json({msg: 'Robot updated successfully'})
     }
     catch(error) {
         // We will be handling the error later
         console.log(error)
     }  
  })
 


  router.delete('/:id', async (req,res) => {
     try {
      const id = req.params.id
      const deletedRobot = await Robot.findByIdAndRemove(id)
      res.json({msg:'Robot was deleted successfully', data: deletedRobot})
     }
     catch(error) {
         // We will be handling the error later
         console.log(error)
     }  
  })
  //Changing the state of the robot
  router.put('/changeState/:id', async (req,res) => {
    try {
     const id = req.params.id
     const robot = await Robot.findById(id)
     if(!robot) return res.status(404).send({error: 'Robot does not exist'})
     const updatedRobot = await Robot.findByIdAndUpdate({_id : id},{processed : req.body.processed})
     res.json({msg: 'Robot state updated successfully'})
    }
    catch(error) {
        // We will be handling the error later
        console.log(error)
    }  
 })



 
  router.put('/changeState/:id', async (req,res) => {
    try {
     const id = req.params.id
     const robot = await Robot.findById(id)
     if(!robot) return res.status(404).send({error: 'Robot does not exist'})
     const updatedRobot = await Robot.findByIdAndUpdate({_id : id},{processed : req.body.processed})
     res.json({msg: 'Robot state updated successfully'})
    }
    catch(error) {
        // We will be handling the error later
        console.log(error)
    }  
 })

 router.get('/myNotificaaton', async (req,res) => {
    try {
    res.json({msg: 'Testing Notification'})
    }
    catch(error) {
        // We will be handling the error later
        console.log(error)
    }  
 })

 
 module.exports = router