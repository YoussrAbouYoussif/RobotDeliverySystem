const express = require('express')
const axios=require('axios')
const router = express.Router()
const mongoose = require('mongoose')
const User=require('../../models/User')
const fetch = require('node-fetch');
const Request = require('../../models/Request')
const Route = require('../../models/Route')
const Robot = require('../../models/Robot')
const Office = require('../../models/Office')

mongoose.set("useFindAndModify", false);

router.get('/', async (req,res) => {
    const requests = await Request.find()
    res.json({data: requests})
})

router.get("/:id", async (req, res) => {
    const id = req.params.id;
      if (id.match(/^[0-9a-fA-F]{24}$/)) {
        const u = await Request.findById(id);
        if(u)
          return res.json({ data: u });
        else
          return res.send({ msg: "Request is not found" });
      }
      else 
       return res.send({ error: "not valid Request id" });
    }
  );


router.post('/', async (req,res) => {
    try {
        // console.log(req.body)
        const newRequest = await Request.create(req.body)
    //  console.log(newRequest)
     res.json({msg:'Request was created successfully', data: newRequest})
    }
    catch(error) {
        // We will be handling the error later
        console.log(error)
    }  
 })
 
 // Update a Request
 router.put('/:id', async (req,res) => {
     try {
    //   const id = req.params.id
      const request = await Request.findById(req.params.id)
      if(!request) return res.status(404).send({error: 'Request does not exist'})
      const updatedRequest = await Request.findOneAndUpdate({_id : req.params.id},req.body)
      res.json({msg: 'Request updated successfully'})
     }
     catch(error) {
         // We will be handling the error later
         console.log(error)
     }  
  })
 
  router.delete('/:id', async (req,res) => {
     try {
      const id = req.params.id
      const deletedRequest = await Request.findByIdAndRemove(id)
      res.json({msg:'Request was deleted successfully', data: deletedRequest})
     }
     catch(error) {
         // We will be handling the error later
         console.log(error)
     }  
  })
 
  router.put('/RobotGoes/:id' ,async (req,res) => {
    try{
        const request = await Request.findById(req.params.id)
        if(!request){
            return res.status(400).json({
                status: 'Error',
                message: 'There is no such Request'
              })
        }
        if(request.state === 'Waiting'){
            const updatedRequest = await Request.findByIdAndUpdate({_id : req.params.id},{state : 'In Progress'})
            // console.log(updatedRequest)
            res.json({msg: 'Request is now in progress'})
        }
        else{
            if(request.state === 'In Progress'){
               res.json({msg: 'Robot is already in porgress'})}
            else{
                res.json({msg: 'Robot has already arrived'})   
            }   
        }    
    }
    catch(error){
        console.log(error)
    }

  })
 
  router.put('/RobotArrived/:id' ,async (req,res) => {
    try{
        const request = await Request.findById(req.params.id)
        if(!request){
            return res.status(400).json({
                status: 'Error',
                message: 'There is no such Request'
              })
        }
        if(request.state === 'In Progress'){
            const updatedRequest = await Request.findByIdAndUpdate({_id : req.params.id},{state : 'Done'})
            // console.log(updatedRequest)
       const finishedRequest = await Request.findByIdAndDelete(req.params.id)
            res.json({msg: 'Robot has now arrived', data:finishedRequest })
        

        }
        else{
            if(request.state === 'Waiting'){
               res.json({msg: 'Robot has not received the package yet'})}
            else{
                res.json({msg: 'Robot has already arrived'})   
            }   
        }
    }
    catch(error){
        console.log(error)
    }

  })

  router.put('/RobotReturns/:id' ,async (req,res) => {
    try{
        const request = await Request.findById(req.params.id)
        const route = await Route.findById(request.route)
        // const query = { 'processed': 'No' }
        // const found = await Request.find(query)
        // found.sort((a,b) => (a.time > b.time) ? 1 : ((b.time > a.time) ? -1 : 0))
        // console.log(found)
        if(!request){
            return res.status(400).json({
                status: 'Error',
                message: 'There is no such Request'
              })
        }
        if(request.state === 'In Progress'){
            const updatedRoute = await Route.findByIdAndUpdate({_id :request.route },{end:route.start,start:{x:50,y:50},path:{s:5}})
            const updatedRequest = await Request.findByIdAndUpdate({_id : req.params.id},{state : 'Rejected'})
            // console.log(updatedRequest)
            res.json({msg: 'There was a problem, the Robot will return the package to the sender'})
        }
        else{
            if(request.state === 'Waiting'){
               res.json({msg: 'Robot has not received the package yet'})}
            else{
                res.json({msg: 'Robot has already arrived'})   
            }   
        }
    }
    catch(error){
        console.log(error)
    }
  })
//Make Request From Robot to Sender
  router.post('/getRobot',async(req,res)=>{
    try{
      const sender1=await User.findOne({email:req.body.sender})
    const receiver1=await User.findOne({email:req.body.receiver})
    const robotLocation =await Robot.find();
    const currLocation=robotLocation[0].current_location
    console.log(currLocation)
    const body={sender:sender1._id,receiver:receiver1._id}
    var request ;
    var senderOffice;
    var receiverOffice;
      request = await Request.create(body);
      senderOffice=await Office.findById(sender1.office);
     // robotLoc=await Office.findOne({point:currLocation});
      console.log(senderOffice)
     var body2={
         end:{x:senderOffice.point.x, y:senderOffice.point.y},
         start:{x:currLocation.x,y:currLocation.y}
     }
     console.log(body2)
     await axios.post(`http://localhost:3000/api/routes/path`,body2)
     .then(res => {
           return res.data})
       .then(json =>{ return res.status(200).send({data:json.data})
            })    
       .catch(err => {return res.status(400).send({msg:error.message,error:"post request"})});
    }catch(error){
        return res.status(400).send({msg:error.message,error:"catch"})
    }
})



//Make Request From Robot to Sender
router.post('/requestRobot',async(req,res)=>{
 try{
    // const body={sender:sender1._id,receiver:receiver1._id}
    var request ;
    var senderOfficeId;
    var receiverOfficeId;
    var senderOffice;
    var receiverOffice;

      request = await Request.findOne({state:"Waiting"})
      console.log(request)

      senderOfficeId=await User.findById(request.sender);
      receiverOfficeId=await User.findById(request.receiver);
      senderOffice=await Office.findById(senderOfficeId.office);
      receiverOffice=await Office.findById(receiverOfficeId.office);
      console.log(senderOfficeId)
     var body={
         end:{x:senderOffice.point.x, y:senderOffice.point.y},
         start:{x:receiverOffice.point.x,y:receiverOffice.point.y}         
     }
     await axios.post(`http://localhost:3000/api/routes/path`,body)
     .then(res => {return res.data})
       .then(json =>{ return res.status(200).send({data:json.data}) })    
       .catch(err => {return res.status(400).send({msg:error.message})} );
    
    body2 = {
        state : 'In Progress'
    }
    await axios.put(`http://localhost:3000/api/requests/${request._id}`,body2)
     .then(res => {return res.data})
       .then(json =>{  res.status(200).send({data:json.data}) })    
       .catch(err => { res.status(400).send({msg:error.message})} );

       console.log("kkkkkkk")
    }catch(error){
        console.log(error.message)
    }
  })
 module.exports = router