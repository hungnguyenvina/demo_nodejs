var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var router = require('./api/routes/router.js');
var Product1 = require('./api/models/ProductModel.js');
var User1 = require('./api/models/UserModel.js');
var config = require('./api/config.js');
var mongoose = require('mongoose');
var path = require('path');
var morgan = require('morgan');
var port = process.env.PORT || 3005;
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');

// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// secret key for create json web token
app.set('superSecret', config.secret); 

// use morgan to log requests to the console
app.use(morgan('dev'));

app.use(express.static(path.join(__dirname, 'public')));

var promise = mongoose.connect(config.database, {
    useMongoClient: true,
    /* other options */
  });

  var db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', function() {
    console.log("we're connected!");
  });




//Product.create({
//    name: 'Product 5 from nodejs',
//    price : 80000
//},function(err,product){
//    if(err) {
//        console.log('errror : '+err);
//    } else {
//        console.log('result : '+product);
//    }
//});

User1.create({
    name: 'Hung Nguyen Theaaa',
    email: 'abc@gmail.com',
    //password : bcrypt.hashSync('123456',12)
    password: '1234567' //password will be encrypted by bcrypt algorithm in UserModel.js using pre('save') of UserSchema
},function(err,product){
    if(err) {
        console.log('errror : '+err);
    } else {
        console.log('user records : '+product);
    }
});

Product1.find(function(err,product){
    //console.log('find : '+ product);
});

app.use('/',function (req, res, next) {
    console.log('Time app:', Date.now());
    //res.header("Access-Control-Allow-Origin", "*");
    //res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    // CORS headers
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With,X-HTTP-Method-Override, Content-Type, Accept, X-Access-Token");
    
    // Set custom headers for CORS
    res.header("Access-Control-Allow-Methods", "POST, GET, PUT, PATCH, DELETE, OPTIONS");

    if (req.method == 'OPTIONS') {
     // res.status(200).end();
     next();
    } else {
      next();
    }
})


app.use('/', router);


app.listen(port,function(){
    console.log('server is running on port '+port);
});