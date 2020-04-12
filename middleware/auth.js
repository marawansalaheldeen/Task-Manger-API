const jwt = require('jsonwebtoken')
const User = require('../models/users')

const auth = async (req,res,next)=>{

    try {
         
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token,'mytoken')
        console.log(decoded._id)
        const user = await User.findOne({_id:decoded._id,'tokens.token':token})

        if(!user){
            throw new Error()
        }

        req.user = user
        next()

    } catch (error) {
        console.log(error)
        res.status(401).send({'error':'please authnticate'})
    }
}

module.exports = auth