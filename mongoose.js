const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/task-manger',{
    useNewUrlParser:true,
    useCreateIndex:true,
    useUnifiedTopology:true   
})

const siteTitle = "Swastika";
const brand = "Swastika";
const baseurl = "http://localhost:3000";

module.exports = {
    siteTitle,
    brand,
    baseurl
}
