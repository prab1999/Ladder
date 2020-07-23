const express = require("express");
const router = express.Router();

const Ladder=require("../../models/Ladder");

router.post('/add',(req, res) =>{
    let ladder = new  Ladder(req.body);
    ladder.save()
        .then(todo => {
            res.status(200).json({'ladder': 'ladder added successfully'});
        })
        .catch(err => {
            console.log(err);
            res.status(400).send('adding new ladder failed');
        });
});

router.get('/:id',(req,res)=>{
    Ladder.find({userId:req.params.id},function(err, ladders) {
        if (err||!ladders) {
            console.log(err);
        } else {
            res.json(ladders);
        }
    });


});

router.post('/update/:id',(req,res)=>{
    console.log(req);
    console.log("hfedf");
    Ladder.findById(req.params.id, function(err, ladder) {
        if (!ladder)
            res.status(404).send("data is not found");
        else
            ladder.problems=req.body.problems;
            
            

            ladder.save().then(ladder => {
                res.json('Ladder updated!');
            })
            .catch(err => {
                res.status(400).send("Update not possible");
            });
    });
});


module.exports = router;