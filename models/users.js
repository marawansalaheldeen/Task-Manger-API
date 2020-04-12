const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')



const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true 
    },
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Email is not valid')
            }
        }
    },
    password:{
        type:String,
        required:true,
        minlength:7,
        trim:true,
        validate(value){
            if(value.toLowerCase().includes('password')){
                throw new Error('password must not includes the word "password')
            }
        }

    },
    age:{
        type:Number,
        required:true,
        validate(value){
            if(value<0){
                throw new Error ('not a valid age')
            }
        }
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }]
})


/////////////////////////////////

userSchema.methods.generateAuthToken = async function(){
        const user = this
        const token = jwt.sign({_id:user._id.toString()},'mytoken')
        user.tokens = user.tokens.concat({token})
        await user.save()
        return token
}

userSchema.statics.findByCredentials = async (email,password)=>{
    const user = await User.findOne({email})

    if(!user){
       throw new Error("Unable to login")
    }

    const isMatch = await bcrypt.compare(password,user.password)

    if(!isMatch){
        throw new Error("Unable to login")
    }

    return user
}

userSchema.pre('save',async function(next){
    const user = this

    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password,8)
    }

    next()
})


const User = mongoose.model('users',userSchema)

module.exports = User