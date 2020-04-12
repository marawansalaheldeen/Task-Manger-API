const mongoose = require('mongoose');
const validator = require('validator');

const tasksSchema = new mongoose.Schema({
    description:{
        type:String,
        required:true
    },
    finished:{
        type:Boolean,
        default:false
    }
})

tasksSchema.pre('save',async function(next){
    const task = this 
    console.log("before saving lol")
    next()
})

const Tasks = mongoose.model('tasks',tasksSchema)

module.exports = Tasks