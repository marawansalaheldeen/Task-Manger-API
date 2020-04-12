const express = require('express')

const router = new express.Router()

const Task = require('../models/tasks')


router.get('/tasks',async(req,res)=>{
    try {
        const task = await Task.find({})
        res.status(201).send(task)    
    } catch (error) {
        res.status(400).send(error)
    }
})

router.get('/tasks/:id',async(req,res)=>{
    const _id = req.params.id
    try {
        const task = await Task.findById(_id)
        if(!task){
            res.status(404).send()
        }
        res.send(task)
    } catch (error) {
        res.send(e)
    }
})

router.post('/task',async(req,res)=>{
    const task = new Task(req.body)
    try {
        await task.save()    
        res.status(200).send(task)
    } catch (error) {
        res.status(400).send(error)
    }
})

router.patch('/tasks/:id',async(req,res)=>{
    const updates =  Object.keys(req.body)
    const allowedupdates = ["description","finished"]
    const isvalidkey = updates.every((update)=>{
        return allowedupdates.includes(update)
    })
    if(!isvalidkey){
        res.status(400).send({error:"invalid update"})
    }
    try {
        const task = await Task.findById(req.params.id)

        updates.forEach((update)=>{
            task[update] = req.body[update]
        })
        await task.save()
        //const task = await Task.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})
        if(!task){
            res.status(404).send()
        }
        res.send(task)
    } catch (error) {
        res.status(400).send(error)
    }
})

router.delete('/tasks/:id',async(req,res)=>{
    try {
         const task = await Task.findByIdAndDelete(req.params.id)
        if(!task){
            res.status(404).send("task not found")
        }
        res.send(task)
    } catch (error) {
        console.log(error)
    }
})

module.exports = router