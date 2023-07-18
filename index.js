// require express/morgan in the 'index.js' file
const express = require('express'),
    morgan = require('morgan'),
    app = express(),
    bodyParser = require('body-parser'),
    uuid = require('uuid'); 
    const PORT = 8080;

const mongoose = require('mongoose');
const Models = require('./models.js');

const Movies = Models.Movie;
const Users = Models.User;

mongoose.connect('mongodb://localhost:27017/myFlixDB', { useNewUrlParser: true, useUnifiedTopology: true });

app.use(bodyParser.json());

app.use(morgan('common'));

// Morgan middleware library to log all requests
let myLogger = (req, res, next) => {
    console.log(req.url);
    next();
};

app.use(myLogger);

// Serves a “documentation.html” file using express.static;
app.use(express.static('public'));

// Express GET route located at endpoint '/'
app.get('/', (req, res) => {
    res.send('Welcome to my top 10 movies!')
});

// Log all requests using Morgan: 
app.get('/secreturl', (req, res) => {
    res.send('This is a secret url with super top-secret content.');
});

// CREATE
app.post('/users', (req, res) => {
    const newUser = req.body;

    if (newUser.name) {
        newUser.id = uuid.v4();
        users.push(newUser);
        res.status(201).json(newUser)
    } else {
        res.status(400).send('users need names')
    }
})

// UPDATE
app.put('/users/:id', (req, res) => {
    const { id } = req.params;
    const updatedUser = req.body;    

    let user = users.find( user => user.id == id );

    if (user) {
        user.name = updatedUser.name;
        res.status(200).json(user);
    } else {
        res.status(400).send('no such user')
    }
})

// CREATE
app.post('/users/:id/:movieTitle', (req, res) => {
    const { id, movieTitle } = req.params;
   

    let user = users.find( user => user.id == id );

    if (user) {
        user.favoriteMovies.push(movieTitle);
        res.status(200).send(`${movieTitle} has been added to use ${id}'s array`);
    } else {
        res.status(400).send('no such user')
    }
})

// DELETE
app.delete('/users/:id/:movieTitle', (req, res) => {
    const { id, movieTitle } = req.params;
   

    let user = users.find( user => user.id == id );

    if (user) {
        user.favoriteMovies = user.favoriteMovies.filter( title => title !== movieTitle );
        res.status(200).send(`${movieTitle} has been removed from user's ${id}'s array`);
    } else {
        res.status(400).send('no such user')
    }
})

// DELETE
app.delete('/users/:id', (req, res) => {
    const { id } = req.params;   

    let user = users.find( user => user.id == id );

    if (user) {
        users = users.filter( user => user.id != id );
        res.status(200).send(`user ${id} has been deleted`);
    } else {
        res.status(400).send('no such user')
    }
})

// READ
app.get('/movies', (req, res) => {
    res.status(200).json(movies);
})

// READ
app.get('/movies/:title', (req, res) => {
    const { title } = req.params; // object detructuring
    const movie = movies.find( movie => movie.Title === title );

    if (movie) {
        res.status(200).json(movie);
    } else {
        res.status(400).send('no such movie')
    }
    
});

// READ
app.get('/movies/genre/:genreName', (req, res) => {
    const { genreName } = req.params; // object detructuring
    const genre = movies.find( movie => movie.Genre.Name === genreName ).Genre;

    if (genre) {
        res.status(200).json(genre);
    } else {
        res.status(400).send('no such genre')
    }
    
});

// READ
app.get('/movies/directors/:directorName', (req, res) => {
    const { directorName } = req.params; // object detructuring
    const director = movies.find( movie => movie.Director.Name === directorName ).Director;

    if (director) {
        res.status(200).json(director);
    } else {
        res.status(400).send('no such director')
    }
    
});

// Error-handling function
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!')
})

// Listen for requests
app.listen(PORT, () => {
    console.log('Your app is listening on port 8080')
});

