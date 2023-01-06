//<<<=====================Importing Module and Packages=====================>>>//
const express = require('express');
const route = require('./routes/route.js');
const { default: mongoose } = require('mongoose');
const app = express();

app.use(express.json());

//===================== Make Relation Between MongoDb and Nodejs with MongoDb Cluster Link  =====================//
mongoose.connect("mongodb+srv://mohdfayeem321:KsdXTXld88GQq4da@cluster0.8eqarb6.mongodb.net/projectTask", {
    useNewUrlParser: true
})
    .then(() => console.log("MongoDb is Connected..."))
    .catch(error => console.log(error))


//===================== Global Middleware for All Route =====================================//
app.use('/', route)


//===================== PORT ================================================================//
app.listen(process.env.PORT || 3000, function () {
    console.log('Express App Running on Port: ' + (process.env.PORT || 3000))
});

//<<<========================================================================================//