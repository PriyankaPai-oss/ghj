const express=require('express');


// router.get('/', function (req, res) {
//     res.send((req,res)=>{

//         res.status(200).json({
//             message:'Yes , its done'
//         });
//     }); //Output=> like { searchid: 'Array of checked checkbox' }
    
// });



// router.post('/', function (req, res) {
//     // res.send(JSON.stringify(req.body)); //Output=> like { searchid: 'Array of checked checkbox' }
//     // console.log(req.body)

//     res.send("hello");
// });

// module.exports=router;
const router = express.Router();
console.log("here");
router.post("/", (req, res)=>{
    
    res.send(JSON.stringify(req.body)); 
    console.log(req.body)
    
});
module.exports = router;