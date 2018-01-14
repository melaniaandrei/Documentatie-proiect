var express = require("express")
var Sequelize = require("sequelize")
var nodeadmin = require("nodeadmin")


//connect to mysql database
var sequelize = new Sequelize('bingsearch', 'root', '', {
    dialect:'mysql',
    host:'localhost'
})

sequelize.authenticate().then(function(){
    console.log('Success')
})

//define a new Model
var Users = sequelize.define('user', {
    name: Sequelize.STRING,
    email: Sequelize.STRING
})

var Words = sequelize.define('word', {
    users_id: Sequelize.INTEGER,
    word: Sequelize.STRING
   
})

Words.belongsTo(Users, {foreignKey: 'users_id', targetKey: 'id'})

var app = express()

app.use('/nodeamin', nodeadmin(app))

//access static files
app.use(express.static('admin'))
//app.use('/admin', express.static('admin'))

app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded()); // to support URL-encoded bodies

// get a list of tourists
app.get('/user', function(request, response) {
    Users.findAll().then(function(users){
        response.status(200).send(users)
    })
        
})

// get one tourist by id
app.get('/user/:id', function(request, response) {
    Users.findOne({where: {id:request.params.id}}).then(function(users) {
        if(users) {
            response.status(200).send(users)
        } else {
            response.status(404).send()
        }
    })
})

//create a new tourists
app.post('/user', function(request, response) {
    Users.create(request.body).then(function(users) {
        response.status(201).send(users)
    })
})

app.put('/user/:id', function(request, response) {
    Users.findById(request.params.id).then(function(user) {
        if(user) {
            user.update(request.body).then(function(user){
                response.status(201).send(user)
            }).catch(function(error) {
                response.status(200).send(error)
            })
        } else {
            response.status(404).send('Not found')
        }
    })
})

app.delete('/user/:id', function(request, response) {
    Users.findById(request.params.id).then(function(user) {
        if(user) {
            user.destroy().then(function(){
                response.status(204).send()
            })
        } else {
            response.status(404).send('Not found')
        }
    })
})

app.get('/word', function(request, response) {
    Words.findAll(
        {
            include: [{
                model: Users,
                where: { id: Sequelize.col('word.users_id') }
            }]
        }
        
        ).then(
            function(words) {
                response.status(200).send(words)
            }
        )
})

app.get('/word/:id', function(request, response) {
    Words.findById(request.params.id).then(
            function(word) {
                response.status(200).send(word)
            }
        )
})

app.post('/word', function(request, response) {
    Words.create(request.body).then(function(word) {
        response.status(201).send(word)
    })
})

app.put('/word/:id', function(request, response) {
    Words.findById(request.params.id).then(function(word) {
        if(word) {
            word.update(request.body).then(function(word){
                response.status(201).send(word)
            }).catch(function(error) {
                response.status(200).send(word)
            })
        } else {
            response.status(404).send('Not found')
        }
    })
})

app.delete('/word/:id', function(request, response) {
    Words.findById(request.params.id).then(function(word) {
        if(word) {
            word.destroy().then(function(){
                response.status(204).send()
            })
        } else {
            response.status(404).send('Not found')
        }
    })
})

app.get('/user/:id/word', function(request, response) {
    Words.findAll({where:{users_id: request.params.id}}).then(
            function(word) {
                response.status(200).send(word)
            }
        )
})

app.listen(8080)