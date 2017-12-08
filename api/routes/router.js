var express = require('express');
var router = express.Router();
var Product1 = require('../models/ProductModel.js');
var User1 = require('../models/UserModel.js');
var jwt = require('jsonwebtoken');
var app = express();
var config = require('../config.js');
var checkAuthenticate = require('../middleware.js');
var bcrypt = require('bcryptjs');

// secret key for create json web token
app.set('superSecret', config.secret); 

router.get('/',function(req,res){
    res.send('hello world!');
});

router.use(function (req, res, next) {
    console.log('Time:', Date.now())
    next()
  })
//router.get('/products', checkAuthenticate(app,jwt),function(req,res){
router.get('/products', function(req,res){
    //res.header("Access-Control-Allow-Origin", "*");
    //res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    Product1.find(function(err,products){
        res.json(products);
    });
});

router.get('/product/:id',function(req,res){
    Product1.findById(req.params.id,function(err,product){
        if(err) {
            res.status(500).json({message:'cannot find product'+ req.params.id});
        } else {
            res.json(product);
        }
    });
});

//router.post('/products', checkAuthenticate(app,jwt),function(req,res){
router.post('/products', function(req,res){
    var product = new Product1(req.body);
    product.save(function(err,product){
        if(err) {
            res.status(500).json({message:'cannot add product'});
        } else {
            res.json(product);
        }
    });
});

router.put('/products/:id',function(req,res){
    Product1.findOneAndUpdate({_id : req.params.id},req.body,function(err,product){
        res.json({status: 'success', message:'update product successfully!'+req.params._id});
    });
});

router.delete('/products/:id',function(req,res){
    Product1.findOneAndRemove({_id : req.params.id},function(err,product){
        if(err) {
            res.json({status: 'failure', message:'cannot delete product!'+req.params._id});
        } else {
            res.json({status: 'success', message:'delete product successfully!'+req.params._id});
        }
    });
});

router.get('/users', checkAuthenticate(app,jwt),function(req,res){
    User1.find(function(err,user){
        res.json(user);
    });
});

router.post('/authenticate',function(req,res){
    console.log('email request',req.body);
    if(!req.body.email || !req.body.password) {
        return res.json({ success: false, message: 'Email and password is not provided' });
    } 

    User1.findOne({"email" : req.body.email},function(err,user){
        if(err) {
            res.json({ success: false, message: 'Authentication failed. User not found.' + err });
        } else {
            if(!user) {
                res.json({ success: false, message: 'Authentication failed. User not found.' });
            } else {
                //found user,check if password provided is correct 
                console.log(req.body.password);
                //console.log(user.password);await user.isValidPassword(password)
                var passwordIsValid = user.isValidPassword(req.body.password);//bcrypt.compareSync(req.body.password,user.password)
                console.log(passwordIsValid);
                //if(user.password !=  req.body.password) {
                if (!passwordIsValid) {
                    res.json({ success: false, message: 'Authentication failed. Invalid email or password.' });
                } else {
                    //this is valid user
                    
                    // if user is found and password is right
                    // create a token with only our given payload
                    // we don't want to pass in the entire user since that has the password
                    const payload = {
                        email: user.email 
                    };

                    var token = jwt.sign(payload,app.get('superSecret'), {
                        expiresIn: '1d' // expires in 24 hours
                    });

                    user.password='youwantthis';
                    // return the information including token as JSON
                    res.json({
                        success: true,
                        message: 'Authenticate sucessfully! Enjoy your token!',
                        user: user,
                        token: token
                    });

                }
            }
        }
    });
});


module.exports = router;

