const express = require('express')
require('./mongoose')


const taskRoute = require('./routers/task')
const userRoute = require('./routers/user')

const jwt = require('jsonwebtoken')

const app = express();
const port = process.env.PORT || 3000



app.use(express.json())

app.use(userRoute)

app.use(taskRoute)



app.listen(port,()=>{
    console.log(`app listen on port ${port}`)
})










