const express = require('express')
var path = require("path");



const taskRoute = require('./routers/task')
const userRoute = require('./routers/user')

const jwt = require('jsonwebtoken')

const app = express();
const port = process.env.PORT || 3000



app.use(express.json())

app.use(userRoute)

app.use(taskRoute)

app.use('/js',express.static(__dirname + '/node_modules/bootstrap/dist/js'));
app.use('/js',express.static(__dirname + '/node_modules/jquery/dist/js'));
app.use('/css',express.static(__dirname + '/node_modules/bootstrap/dist/css'));
app.use(express.static(__dirname + '/assets'));
app.use(express.static(__dirname + '/views'));



app.set('view engine','ejs');


app.listen(port,()=>{
    console.log(`app listen on port ${port}`)
})










