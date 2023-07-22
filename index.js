// require express/morgan in the 'index.js' file
const express = require('express'),
    bodyParser = require('body-parser'),
    uuid = require('uuid'); 

const morgan = require('morgan');
const app = express();
const mongoose = require('mongoose');    
const Models = require('./models.js'); 

const Movies = Models.Movie;
const Users = Models.User;
const Genres = Models.Genre;
const Directors = Models.Director;

const PORT = 8080;

mongoose.connect('mongodb://127.0.0.1:27017/myFlixDB', { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
});

app.use(bodyParser.json());

//log requests to server
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
    res.send('Welcome to MyFlix!');
});

// 1. Get all movies
app.get('/movies', (req, res) => {
    Movies.find()
        .then((movies) => {
            res.status(201).json(movies);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
    });

// Get all users
app.get('/users', (req, res) => {
    Users.find()
        .then((users) => {
            res.status(201).json(users);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
    });

// 2. Get a movie by movie title
app.get('/movies/:Title', async (req, res) => {
    await Movies.findOne({ Title: req.params.Title })
        .then((movie) => {
            res.json(movie);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
    });

// 3. Return data about a genre (description) by name/title
app.get('/genre/:Name', async (req, res) => {
    await Genres.findOne({ Name: req.params.Name })
        .then((genre) => {
            res.json(genre.Description);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
    });

// 4. Return data about a director by name
app.get('/director/:Name', (req, res) => {
    Directors.findOne( { Name: req.params.Name })
    .then((director) => {
        res.json(director);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});

// 5. Allow new users to register
app.post('/users', async (req, res) => {
    await Users.findOne({ Username: req.body.Username })
        .then((user) => {
            if (user) {
                return res.status(400).send(req.body.Username + 'already exists');
            } else {
              Users
                .create({
                    Username: req.body.Username,
                    Password: req.body.Password,
                    Email: req.body.Email, 
                    Birth: req.body.Birth,
                })
                .then((user) =>{res.status(201).json(user) })
              .catch((error) => {
                console.error(error);
                res.status(500).send('Error: ' + error);
              })
            }
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send('Error: ' + error);
        });
    });

// 6. Update a user's info, by username
app.put('/users/:Username', async (req, res) => {
    await Users.findOneAndUpdate({ Username: req.params.Username 
    }, { $set: 
      {
        Username: req.body.Username,
        Password: req.body.Password,
        Email: req.body.Email,
        Birth: req.body.Birth
      }
    },
    { new: true })
    .then((updatedUser) => {
        res.json(updatedUser);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    })

});

// 7. Add a movie to a user's list of favorites
app.post('/users/:Username/movies/:MovieID', async (req, res) => {
    await Users.findOneAndUpdate({ Username: req.params.Username}, 
    {
        $push: { FavoriteMovies: req.params.MovieID }
    },
    { new: true })
    .then((updatedUser) => {
        res.json(updatedUser);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});

// 8. Delete a movie from a user's list of favorites
app.delete('/users/:Username/movies/:MovieID', async (req, res) => {
    await Users.findOneAndUpdate({ Username: req.params.Username}, 
    {
        $pull: { FavoriteMovies: req.params.MovieID }
    },
    { new: true })
    .then((updatedUser) => {
        res.json(updatedUser);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});
    

// 9. Delete a user by username
app.delete('/users/:Username', async (req, res) => {
    await Users.findOneAndRemove({ Username: req.params.Username })
        .then((user) => {
            if (!user) {
                res.status(400).send(req.params.Username + ' was not found');
            } else {
                res.status(200).send(req.params.Username + ' was deleted');
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
    });



// Log all requests using Morgan: 
app.get('/secreturl', (req, res) => {
    res.send('This is a secret url with super top-secret content.');
});



// Get a user by username
app.get('/users/:Username', (req, res) => {
    Users.findOne({ Username: req.params.Username })
        .then((user) => {
            res.json(user);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
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

