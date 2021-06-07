const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')

const Route = require('../../models/Route')

// variables and constants used by path finding algorithm
var rows=10;
var cols=26;
var grid = new Array(cols);
var openSet = [];
var closedSet = [];
var cameFrom = [];
var start ;
var end ;

function Cell(i,j){
  this.i=i
  this.j=j
  this.f=0
  this.g=0
  this.h=0
  this.neighbours = [];
  this.prev = undefined;
  this.wall = true;

  j = Math.abs(rows - j) ;


  if( j>=2 &&j<=10){
    if(i>=0&&i<=3){
      this.wall = false;
    }
  }

  if(j>=0&&j<=2){
    this.wall=false;
  } 
  
  this.show = function(col){
    fill(col);
    if(this.wall){
      fill(0)
    }
    noStroke();
    rect(this.i*w,this.j*h,w-1,h-1) 
  }

  this.addNeighbours = function (grid){
    var i = this.i;
    var j = this.j;
    // add neighbours that inside the grid
    if(i < cols-1){
     this.neighbours.push(grid[i+1][j]);
    }
    if(j < rows-1){
     this.neighbours.push(grid[i][j+1]);
    }
    if(i>0){
     this.neighbours.push(grid[i-1][j]);
    }
    if(j>0){
     this.neighbours.push(grid[i][j-1]);
    }

  }
}

function heuristic(a,b){
  var d = Math.abs(a.i,b.i)+Math.abs(a.j,b.j);
  return d
}

var map = (function (){
  var executed = false;
 return function () {
   if(!executed){
     executed=true;
  //setting up 2D array
 for( var i =0;i<cols;i++){
   grid[i]=new Array(rows)
 }

 // populate map cells
 for( var i =0;i<cols;i++){
  for(var j=0;j<rows;j++){
    grid[i][j]=new Cell(i,j);
  }
 }
 // add cells neighbours
 for( var i =0;i<cols;i++){
  for(var j=0;j<rows;j++){
    grid[i][j].addNeighbours(grid)
  }
 }
}
//  // 
//  start = grid[0][0];
//  end = grid[9][6];

//  openSet.push(start);
};
})();

 const bodyParser = require('body-parser');
 // use path finding algorithm to get new route
 router.post("/path" , async (req,res)=>{
  try{
     
    console.log(req.body)
    map();
    
    var si = req.body.start.x;
    var sj = req.body.start.y;
    start = grid[si][sj];
    console.log("---------------------------")
    console.log(req.body)
    console.log("nada")
    var ei = req.body.end.x;
    var ej = req.body.end.y;
    console.log(ei)
    console.log(ej)
    end = grid[ei][ej];
    openSet.push(start);
    console.log(openSet)
    
    while(openSet.length>0){
      var min = 0;
      for(var i =0;i<openSet.length;i++){
        if(openSet[i].f<openSet[min].f){
          min=i;
        }
      }
  
      var curr = openSet[min];
      
      if(curr===end){
        console.log("Done");
        var temp = curr ;
        cameFrom.push(temp);
        while(temp.prev){
          cameFrom.push(temp.prev);
          temp = temp.prev;
        }
  
        for( var i =cameFrom.length-1;i>=0;i--){
          if(cameFrom[i])
          console.log(cameFrom[i].i+" , "+cameFrom[i].j );
        }

        var jason = [];
        for(var i = 0;i<cameFrom.length;i++){
          jason[i]="point : ["+cameFrom[i].i+","+cameFrom[i].j+"]";
        }
  
         // return  array
         var jfile = JSON.stringify(jason);
         console.log(jfile)
         return res.status(200).send({ msg: "path is calculated",data :jfile});

      }
  
      //1- remove curr from open set
      for( var i = openSet.length ; i>=0 ; i--){
        if(openSet[i] === curr){
          openSet.splice(i,1);
  
        }
      } 
      //2- add curr to closed set
        closedSet.push(curr);
  
      var neighbours = curr.neighbours;
     // console.log("neeeeeeeeeeeeeeeeeeeigbours")
     // console.log(curr)
      //console.log(neighbours)
      for( var i = 0 ; i<neighbours.length ;i++){
         var neighbour = neighbours[i];
         if(!closedSet.includes(neighbour)&& !neighbour.wall){
           var tentativeG = curr.g + heuristic(neighbour,curr);
  
           if(!openSet.includes(neighbour)){
             openSet.push(neighbour);
  
            }
            else if (tentativeG >= neighbour){
              continue;
            }
  
            neighbour.g = tentativeG ;
            neighbour.h = heuristic(neighbour,end);
            neighbour.f = neighbour.g + neighbour.h;
            neighbour.prev = curr; 
          }
      }
     // console.log("for this loop");
    }
    console.log("openList")
   // console.log(openSet)
      console.log("current")
   //   console.log(curr)
      //if not returned -> no solution
      return res.status(404).send({ msg: "path can't be calculated"});

  }
  catch(error){
    console.log(error);
    return res.status(400).send({ msg: "Request can't be done",error});
    
  }
})
  







router.get('/', async (req,res) => {
    const routes = await Route.find()
    res.json({data: routes})
})

router.get("/:id", async (req, res) => {
    const id = req.params.id;
      if (id.match(/^[0-9a-fA-F]{24}$/)) {
        const u = await Route.findById(id);
        if(u)
          return res.json({ data: u });
        else
          return res.send({ msg: "Route is not found" });
      }
      else 
       return res.send({ error: "not valid Route id" });
    }
  );


router.post('/', async (req,res) => {
    try {
        // console.log(req.body)
        const newRoute = await Route.create(req.body)
    //  console.log(newRoute)
     res.json({msg:'Route was created successfully', data: newRoute})
    }
    catch(error) {
        // We will be handling the error later
        console.log(error)
    }  
 })
 
 // Update a route
 router.put('/:id', async (req,res) => {
     try {
    //   const id = req.params.id
      const route = await Route.findById(req.params.id)
      if(!route) return res.status(404).send({error: 'Route does not exist'})
      const updatedRoute = await Route.findByIdAndUpdate({_id : req.params.id},req.body)
      res.json({msg: 'Route updated successfully'})
     }
     catch(error) {
         // We will be handling the error later
         console.log(error)
     }  
  })
 
  
  router.delete('/:id', async (req,res) => {
     try {
      const id = req.params.id
      const deletedRoute = await Route.findByIdAndRemove(id)
      res.json({msg:'Route was deleted successfully', data: deletedRoute})
     }
     catch(error) {
         // We will be handling the error later
         console.log(error)
     }  
  })
 




 module.exports = router