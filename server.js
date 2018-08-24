const express = require('express');
const bodyparser = require("body-parser");
const app = express();
const jwt_secret = 'WU5CjF8fHxG40S2t7oyk';
const jwt_admin = 'SJwt25Wq62SFfjiw92sR';

var jwt = require('jsonwebtoken');
var mongojs = require('mongojs');
var MongoId = require('mongodb').ObjectID;
var db = mongojs(process.env.MONGOLAB_URI || 'localhost:27017/kupilaptopDB', ['laptopi', 'users']);
var port = process.env.PORT || 5000;
var bcrypt = require('bcrypt');



app.use(express.static(__dirname + '/static'));
app.use(express.json()); // to support JSON-encoded bodies
app.use(bodyparser.json());
app.use(express.urlencoded({
    extended: true
})); // to support URL-encoded bodies


app.use('/user/', function (request, response, next) {
  jwt.verify(request.get('JWT'), jwt_secret, function (error, decoded) {
    if (error) {
      response.status(401).send('Unauthorized access');
    } else {
      db.collection("users").findOne({ '_id': new MongoId(decoded._id) }, function (error, user) {
        if (error) {
          throw error;
        } else {
          if (user) {
            next();
          } else {
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
    console.log(docs);
    res.json(docs);
  });
});
app.get('/users/laptopi', function (req, res) {
  console.log('I received a GET request');
  db.laptopi.find(function (err, docs) {
    console.log(docs);
    res.json(docs);
  });
});

app.post('/register', function(req, res, next) {
  req.body.type = "user";
  req.body._id = null;
  var user = req.body;
  var find = req.body.email;
  console.log(find);
      db.collection('users').find({
        email : find
      }).toArray(function (err,result){
        if(err) throw err;

        console.log(result);

        if(result.length > 0){
          res.sendStatus(204);
        } else {
          db.users.insert(user,function(err,data) {
              if (err) return console.log(err);
              res.setHeader('Content-Type', 'application/json');
              res.send(user);
          })
        }
      })


});


app.post('/admin/laptopi', function(req, res) {
  req.body._id = null;
  var laptop = req.body;
  db.collection('laptopi').insert(laptop, function(err, data) {
      if (err) return console.log(err);
      res.setHeader('Content-Type', 'application/json');
      res.send(laptop);
  })
});

app.delete('/admin/laptopi/:id', function (req, res) {
  var id = req.params.id;
  console.log(id);
  db.laptopi.remove({_id: mongojs.ObjectId(id)}, function (err, doc) {
    res.json(doc);
  });
});


app.get('/admin/laptopi/:id', function (req, res) {
  var id = req.params.id;
  console.log(id);
  db.laptopi.findOne({_id: mongojs.ObjectId(id)}, function (err, doc) {
    res.json(doc);
  });
});

app.put('/admin/laptopi/:id', function (req, res) {
  var id = req.params.id;
  console.log(req.body.name);
  db.laptopi.findAndModify({
    query: {_id: mongojs.ObjectId(id)},
    update: {$set: {ime: req.body.ime,brend: req.body.brend,vrsta: req.body.vrsta,procesor: req.body.procesor,procesorGeneracija: req.body.procesorGeneracija,brzinaProcesora: req.body.brzinaProcesora,ram: req.body.ram,graficka: req.body.graficka,vrstaGraficke: req.body.vrstaGraficke,kapacitetGraficke: req.body.kapacitetGraficke,vrstaMemorije: req.body.vrstaMemorije,kapacitetMemorije: req.body.kapacitetMemorije,velicina: req.body.velicina,cijena: req.body.cijena}},
    new: true}, function (err, doc) {
      res.json(doc);
    }
  );
});

app.listen(port, function(){
  console.log('Node app is running on port', port)
})