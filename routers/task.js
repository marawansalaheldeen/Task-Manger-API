const express = require('express')
const auth = require('../middleware/auth')
const router = new express.Router()

const Task = require('../models/tasks')


router.get('/tasks',auth,async(req,res)=>{
    const match  = {}
    const sort = {}


    if(req.query.sortBy){
        const parts = req.query.sortBy.split(':')

        sort[parts[0]] = parts[1] === "desc" ? -1 : 1
    }
    try {
        //const task = await Task.find({owner:req.user._id})
        await req.user.populate({
                path:'tasks',
                match,
                options:{
                    limit:parseInt(req.query.limit),
                    skip:parseInt(req.query.skip),
                    sort
                }
        }).execPopulate()
        res.status(201).send(req.user.tasks)    
    } catch (error) {
        res.status(400).send(error)
    }
})

router.get('/tasks/:id',auth,async(req,res)=>{
    const _id = req.params.id
    try {
        const task = await Task.findOne({_id,owner:req.user._id})
        if(!task){
            res.status(404).send()
        }
        res.send(task)
    } catch (error) {
        res.send(error)
    }
})

router.post('/task',auth,async(req,res)=>{
    const task = new Task({
        ...req.body,
        owner:req.user._id
    })

    try {
        await task.save()    
        res.status(200).send(task)
    } catch (error) {
        res.status(400).send(error)
    }
})

router.patch('/tasks/:id',auth,async(req,res)=>{
    const updates =  Object.keys(req.body)
    const allowedupdates = ["description","finished"]
    const isvalidkey = updates.every((update)=>{
        return allowedupdates.includes(update)
    })
    if(!isvalidkey){
        res.status(400).send({error:"invalid update"})
    }
    try {
        const task = await Task.findOne({_id:req.params.id,owner:req.user._id})
        if(!task){
            res.status(404).send()
        }        

        updates.forEach((update)=>{
            task[update] = req.body[update]
        })
        await task.save()
        //const task = await Task.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})

        res.send(task)
    } catch (error) {
        res.status(400).send(error)
    }
})

router.delete('/tasks/delete/:id',auth,async(req,res)=>{
    try {
         const task = await Task.findOneAndDelete({_id:req.params.id,owner:req.user._id})
        if(!task){
            res.status(404).send("task not found")
        }
        res.send(task)
    } catch (error) {
        console.log(error)
    }
})

module.exports = router