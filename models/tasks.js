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
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'User'
    },

},{
    timestamps :true
})

tasksSchema.pre('save',async function(next){
    const task = this 
    console.log("before saving lol")
    next()
})

const Tasks = mongoose.model('tasks',tasksSchema)

module.exports = Tasks