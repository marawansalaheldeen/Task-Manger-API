const express = require('express')
const User = require('../models/users')
const auth = require('../middleware/auth')
const bodyparser = require('body-parser')
const mongoose = require('../mongoose')
const expressValidators = require('express-validator')
var urlencodedparser = bodyparser.urlencoded({extended:true});
const router = new express.Router()

const baseurl = mongoose.baseurl


router.get('/loginpage',(req,res)=>{
    try {
        res.render('../views/signup',{
            baseurl:baseurl
        })    
        res.send()
    } catch (error) {
        console.log(error)
    }
    
})

router.post('/loginpage',urlencodedparser,async(req,res)=>{
    
    var sql = {
        firstname:req.body.firstname,
        lastname:req.body.lastname,
        email:req.body.usermail,
        password:req.body.userpassword
    }
   // console.log(req.body.firstname,req.body.lastname,req.body.usermail,req.body.userpassword)
    const user = new User(sql)
    const loginstatus= false
    try {
        await user.save()
        res.status(201).render('../views/home',{
            fname:req.body.firstname,
            lname:req.body.lastname,
            loginstatus
        })
    } catch (error) {
        res.status(400).send(error)
    }
})

router.post('/users/login',urlencodedparser,async(req,res)=>{
    try {
        const user = await User.findByCredentials(req.body.email,req.body.password)
        const fname = user.firstname
        const lname = user.lastname
        const loginstatus= true
        const token = await user.generateAuthToken()

        res.render('../views/home',{
            user,
            token,
            fname,
            lname,
            loginstatus
        })
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



router.patch('/user/updateprofile',auth,async(req,res)=>{
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
   // const user = await User.findById(req.params.id)
    updates.forEach((update)=>{
        req.user[update] = req.body[update] 
    })
    await req.user.save()
    res.send(req.user)

    //const user = await User.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})
} catch (error) {
    res.status(400).send(error)
}
})

router.post('/users/logout',auth,async (req,res)=>{

    try {
        req.user.tokens = req.user.tokens.filter((token)=>{
            return token.token !== req.token

        })

        await req.user.save()
        res.send()
    } catch (error) {
        console.log(error)
        res.status(500).send()
    }
})

router.post('/users/logoutAll',auth,async(req,res)=>{
    try {

        req.user.tokens = []
        await req.user.save()    
        console.log(req.user.tokens)
        res.send()

    } catch (error) {
        console.log(error)
        res.status(500).send()
    }
})



router.delete('/user/delete',auth,async(req,res)=>{
    try {
        // const user = await User.findByIdAndDelete(req.params.id)

        // if(!user){
        //     res.status(404).send()
        // }

        await req.user.remove()
        res.send(req.user)

    } catch (error) {
        console.log(error)
        res.send(error)
    }
})

module.exports = router