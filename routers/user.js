const express = require('express')
const User = require('../models/users')
const auth = require('../middleware/auth')
const router = new express.Router()



router.post('/users/login',async(req,res)=>{
    try {
        const user = await User.findByCredentials(req.body.email,req.body.password)

        const token = await user.generateAuthToken()

        res.send({user,token})
    } catch (error) {

        console.log(error)
        res.status(400).send(error)
    }
})

router.get('/users/profile',auth,async(req,res)=>{
        res.send(req.user)
})

router.get('/users/:id',async(req,res)=>{
    const _id = req.params.id
    try {
        const users = await User.findById(_id)
        if(!users){
            return res.status(404).send()
        }    
        res.send(users)
    } catch (error) {
        res.status(404).send(error)   
    }
})

router.post('/users',async(req,res)=>{
    const user = new User(req.body)
    try {
        await user.save()
        res.status(201).send(user)
    } catch (error) {
        res.status(400).send(error)
    }
})

router.patch('/user/:id',async(req,res)=>{
    const updates = Object.keys(req.body)
    const allowedupdates = ["name","email","password","age"]
    const isvalidkey = updates.every((update)=>{
        console.log(allowedupdates.includes(update))
        return allowedupdates.includes(update)
    })

    if(!isvalidkey){
        res.status(400).send({error:"invalid update"})
    }
    try {
        const user = await User.findById(req.params.id)
        updates.forEach((update)=>{
            user[update] = req.body[update]
            
        })
        await user.save()

        //const user = await User.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})
        if(!user){
            res.status(404).send()
        }    
        res.send(user)
    } catch (error) {
        res.status(400).send(error)
    }
})



module.exports = router