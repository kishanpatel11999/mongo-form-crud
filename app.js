const express = require('express');
var app = express();
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');


//body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({urlencoded:true}));


//set template engine ejs in views
// app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs');

//set static path stuff
app.use('/stuff',express.static('stuff'));



//mongoose
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/task1");

mongoose.connection.once('open',()=>{
    console.log('database connection has been made...')
}).on('error',()=>{
    console.log('some error occure db not connect');
});

var dataSchema = new mongoose.Schema({
    name:String,
    email:String,
    phone:String
});

var userData = new mongoose.model('userData',dataSchema);




//app home route
app.get('/',(req,res)=>{
    // res.send('<h1>This is home page</h1>');
    res.render('home');
})


//app form route
app.get('/form',(req,res)=>{
    // res.render('form');

    userData.find({},(err,data)=>{
        if(err) throw err
        else res.render('form',{data:data,searchquery:req.query.search})
    })
})


//find form
app.get('/form/find',(req,res)=>{
    // res.send("find call")

    console.log(req.query.search)

    userData.find({},(err,value)=>{
        if(err) throw err;
        else {
            // for(var i = 0 ; i< value.length ; i++){
                // if(value[i].name == req.query.search) {
                    res.render('formfind',{value:value,searchquery:req.query.search})
                // }
                // else{
                    // res.render('formfind',{value:value,searchquery:req.query.search})

                // }   
            // }
        }
    })
})



app.get('/delete/:id',(req,res)=>{
    // res.send("delete call");
    console.log(req.params.id);
  
    userData.findOneAndRemove({'_id' : req.params.id}, function (err,offer){
        if(err) throw err;
        res.redirect('/form');
    })

})



//post
app.post('/form',(req,res,next)=>{
    // res.send('button click');
    var dataStore = new userData(req.body);
    dataStore.save().then(
        item => {
            console.log(req.body);
           
                res.redirect('form');
                // app.get('/view')
        }
    )
})


//app about us route
app.get('/about',(req,res)=>{
    res.render('about');
})




const port = 3000;
const hostname = '127.0.0.1';
app.listen(port , hostname ,()=>{
    console.log(`Server started on port: ${port} and host: ${hostname}`);
})