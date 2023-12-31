// require express/morgan in the 'index.js' file
const express = require('express'),
    bodyParser = require('body-parser'),
    uuid = require('uuid'); 

const morgan = require('morgan');
const app = express();
const mongoose = require('mongoose');    
const Models = require('./models.js'); 
const cors = require('cors');
const { check, validationResult } = require('express-validator');

const Movies = Models.Movie;
const Users = Models.User;

const PORT = 8080;
mongoose.connect( 'process.env.CONNECTION_URI', { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
});

// mongoose.connect('mongodb://127.0.0.1:27017/test', { 
//     useNewUrlParser: true, 
//     useUnifiedTopology: true 
// });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));

// Restrict requests to specific origins
let allowedOrigins = ['http://localhost:8080', 'http://testsite.com', 'https://myflix-app-gamoore7.netlify.app'];

app.use(cors(
    {
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) { // If a specific origin isn’t found on the list of allowed origins
        let message = 'The CORS policy for this application doesn’t allow access from origin ' + origin;
        return callback(new Error(message), false);
      }
      return callback(null, true);
    }
  }
  ));

let auth = require('./auth')(app);
const passport = require('passport');
require('./passport');

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
app.get('/movies', passport.authenticate('jwt', { session: false }), (req, res) => {
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
app.get('/movies/:Title', passport.authenticate('jwt', { session: false }), async (req, res) => {
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
app.get('/genre/:Name', passport.authenticate('jwt', { session: false }), async (req, res) => {
    await Movies.findOne({ 'Genre.Name': req.params.Name })
        .then((genre) => {
            res.json(genre.Genre);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
    });

// 4. Return data about a director by name
app.get('/director/:Name', passport.authenticate('jwt', { session: false }), (req, res) => {
    Movies.findOne( { 'Director.Name': req.params.Name })
    .then((director) => {
        res.json(director.Director);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});

// 5. Allow new users to register
app.post('/users', [
    check('Username', 'Username is required').isLength({min: 5}),
    check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
    check('Password', 'Password is required').not().isEmpty(),
    check('Email', 'Email does not appear to be valid').isEmail()   
], async (req, res) => {

        // check the validation object for errors
          let errors = validationResult(req);
      
          if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
          }
      
    let hashedPassword = Users.hashPassword(req.body.Password);
    await Users.findOne({ Username: req.body.Username })
        .then((user) => {
            if (user) {
                return res.status(400).send(req.body.Username + 'already exists');
            } else {
              Users
                .create({
                    Username: req.body.Username,
                    Password: hashedPassword,
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
app.put('/users/:Username',
[
    check('Username', 'Username is required').isLength({min: 5}),
    check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
    check('Password', 'Password is required').not().isEmpty(),
    check('Email', 'Email does not appear to be valid').isEmail()
], 
passport.authenticate('jwt', { session: false }), async (req, res) => {

    // check the validation object for errors
      let errors = validationResult(req);
  
      if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
      }

      let hashedPassword = Users.hashPassword(req.body.Password);    

    //condition to check 
    if(req.user.Username !== req.params.Username){
        return res.status(400).send('Permission denied');
    }
    await Users.findOneAndUpdate({ Username: req.params.Username 
    }, { $set: 
      {
        Username: req.body.Username,
        Password: hashedPassword,
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
app.post('/users/:Username/movies/:MovieID', passport.authenticate('jwt', { session: false }), async (req, res) => {
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
app.delete('/users/:Username/movies/:MovieID', passport.authenticate('jwt', { session: false }), async (req, res) => {
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
app.delete('/users/:Username', passport.authenticate('jwt', { session: false }), async (req, res) => {
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

    // Error-handling function
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!')
})

// Listen for requests
const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0',() => {
 console.log('Listening on Port ' + port);
});



