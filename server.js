const express = require('express');
const bodyparser = require("body-parser");
const app = express();
const jwt_secret = 'WU5CjF8fHxG40S2t7oyk';
const jwt_admin = 'SJwt25Wq62SFfjiw92sR';

var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var mongojs = require('mongojs');
var MongoId = require('mongodb').ObjectID;
var db = mongojs(process.env.MONGOLAB_URI || 'mongodb://kupilaptop:aldin123@ds125342.mlab.com:25342/kupilaptop_db', ['laptopi', 'orders','users','contacts']);
var port = process.env.PORT || 5000;



app.use(express.static(__dirname + '/static'));
app.use(express.json()); // to support JSON-encoded bodies
app.use(bodyparser.json());
app.use(express.urlencoded({
    extended: true
})); // to support URL-encoded bodies


app.use('/user/',function(request,response,next){
  jwt.verify(request.get('JWT'), jwt_secret, function(error, decoded) {      
    if (error) {
      response.status(401).send('Unauthorized access');    
    } else {
      db.collection("users").findOne({'_id': new  mongojs.ObjectId(decoded._id)}, function(error, user) {
        if (error){
          throw error;
        }else{
          if(user){
            next();
          }else{
            response.status(401).send('Credentials are wrong.');
          }
        }
      });
    }
  });  
})

app.use('/admin/',function(request,response,next){
  jwt.verify(request.get('JWT'), jwt_admin, function(error, decoded) {     
    if (error) {
      response.status(401).send('Unauthorized access'); 
      console.log(error);   
    } else {
      db.collection("users").findOne({'_id': new  mongojs.ObjectId(decoded._id)}, function(error, users) {
        if (error){
          throw error;
        }else{
          if(users){
            next();
          }else{
            response.status(401).send('Credentials are wrong.');
          }
        }
      });
    }
  });  
})

app.post('/login', function(req, res) {
  var user = req.body;
  db.collection('users').findOne({
      'email': user.email,
  }, function(error, users) {
      if (error) {
          throw error;
      } 
      if(users) {
          bcrypt.compare(user.password, users.password, function(err, resp){
              if(resp === true){
                  if(users.type == "admin"){
                      var token = jwt.sign(users, jwt_admin, {
                          expiresIn: 60*60*24
                      });
                      res.send({
                          success: true,
                          message: 'Admin Authenticated',
                          token: token,
                          type : 'admin'
                      })
                      console.log("Admin authentication passed.");
                  }
                  else if(users.type == "user"){
                      var token = jwt.sign(users, jwt_secret, {
                          expiresIn: 60*60*24
                      });
                      res.send({
                          success: true,
                          message: 'Authenticated',
                          token: token,
                          type: "user"
                      })
                      console.log("Authentication passed.");
                  }
              }
              else {
                  res.send({
                      user : false
                  })
              }
          })
      }
  });
});


app.get('/admin/laptopi', function (req, res) {
  console.log('I received a GET request');
  db.laptopi.find(function (err, docs) {
    res.json(docs);
  });
});

app.get('/users/laptopi', function (req, res) {
  console.log('I received a GET request');
  db.laptopi.find(function (err, docs) {
    res.json(docs);
  });
});

app.get('/users/orders', function (req, res) {
  console.log('I received a GET request');
  db.orders.find(function (err, docs) {
    res.json(docs);
  });
});

app.get('/users/contacts', function (req, res) {
  console.log('I received a GET request');
  db.contacts.find(function (err, docs) {
    res.json(docs);
  });
});





app.post('/register', function(req, res, next) {
  req.body.type = "user";
  req.body._id = null;
  req.body.password_confirm = null;
  var user = req.body;
  bcrypt.hash(user.password, 10, function(err, hash) {
      user.password = hash;
      db.collection('users').insert(user, function(err, data) {
          if (err) return console.log(err);
          res.setHeader('Content-Type', 'application/json');
          res.send(user);
      })
  })
});

app.post('/admin/addLaptop', function(req, res){
    req.body._id = null;
    var laptop = req.body;
    db.collection('laptopi').insert(laptop, function(err, data){
        if(err) return console.log(err);
        res.setHeader('Content-Type', 'application/json');
        res.send(laptop);
    })
});
app.post('/users/addContact', function(req, res){
  req.body._id = null;
  var contact = req.body;
  db.collection('contacts').insert(contact, function(err, data){
      if(err) return console.log(err);
      res.setHeader('Content-Type', 'application/json');
      res.send(contact);
  })
});



app.post('/users/makeOrder/:ime/:cijena', function(req, res){
  req.body._id = null;
  req.body.laptop_ime = req.params.ime;
  req.body.laptop_cijena = req.params.cijena;
  var order = req.body;
  console.log(order);
  db.collection('orders').insert(order, function(err, data){
      if(err) return console.log(err);
      res.setHeader('Content-Type', 'application/json');
      res.send(order);
  })
});

app.delete('/admin/laptopi/:id', function (req, res) {
  var id = req.params.id;
  db.laptopi.remove({_id: mongojs.ObjectId(id)}, function (err, doc) {
    res.json(doc);
  });
});


app.get('/admin/laptopi/:id', function (req, res) {
  var id = req.params.id;
  db.laptopi.findOne({_id: mongojs.ObjectId(id)}, function (err, doc) {
    res.json(doc);
  });
});

app.put('/admin/laptopi/:id', function (req, res) {
  var id = req.params.id;
  db.laptopi.findAndModify({
    query: {_id: mongojs.ObjectId(id)},
    update: {$set: {ime: req.body.ime,brend: req.body.brend,vrsta: req.body.vrsta,procesor: req.body.procesor,procesorGeneracija: req.body.procesorGeneracija,brzinaProcesora: req.body.brzinaProcesora,ram: req.body.ram,graficka: req.body.graficka,vrstaGraficke: req.body.vrstaGraficke,kapacitetGraficke: req.body.kapacitetGraficke,vrstaMemorije: req.body.vrstaMemorije,kapacitetMemorije: req.body.kapacitetMemorije,velicina: req.body.velicina,cijena: req.body.cijena}},
    new: true}, function (err, doc) {
      res.json(doc);
    }
  );
});

app.get("/singleLaptop/:laptop_id", function(req, res) {
    db.collection('laptopi').findOne({
        _id: new MongoId(req.params.laptop_id)
    }, function(err, doc) {
        if (err) {
            handleError(res, err.message, "There is an error in finding a car");
        } else {
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json(doc);
        }
    });
});

app.get("/getSingle/:id", function(req, res){
    db.collection('laptopi').find({
        _id: new MongoId(req.params.id)
    }).toArray((err, doc) => {
        if(err) return console.log(err);
        res.setHeader('Content-Type', 'application/json');
        res.send(doc);
    });
});

app.listen(port, function(){
  console.log('Node app is running on port', port)
})