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
mongoose.connect(process.env.CONNECTION_URI, { 
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


/**
 * Get all movies
 *
 * @function
 * @name getAllMovies
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} - A Promise that resolves when the movie request process is complete.
 * @throws {Error} - If there is an unexpected error during the process or if permission is denied.
 * @returns {Object}[] allMovies - The array of all movies in the database.
 * 
 */

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


/**
 * Get a movie by movie title
 *
 * @function
 * @name getOneMovie
 * @param {Object} req - Express request object with parameter: movieId (movie ID).
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} - A Promise that resolves when the movie request process is complete.
 * @throws {Error} - If there is an unexpected error during the process or if permission is denied.
 * @returns {Object} reqMovie - The object containing the data for the requested movie.
 * 
 */

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

/**
 * Return data about a genre (description) by name/title
 *
 * @function
 * @name getGenre
 * @param {Object} req - Express request object with parameter: genreName (genre name).
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} - A Promise that resolves when the genre request process is complete.
 * @throws {Error} - If there is an unexpected error during the process or if permission is denied.
 * @returns {Object} reqGenre - The object containing the data for the requested genre.
 * 
 */

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

/**
 * Return data about a director by name
 *
 * @function
 * @name getOneDirector
 * @param {Object} req - Express request object with parameter: Name (director name).
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} - A Promise that resolves when the director request process is complete.
 * @throws {Error} - If there is an unexpected error during the process or if permission is denied.
 * @returns {Object} reqDirector - The object containing the data for the requested director.
 * 
 */

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

/**
 * Allow new users to register
 *
 * @function
 * @name createUser
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} - A Promise that resolves when the user creation process is complete.
 * @throws {Error} - If there is an unexpected error during the user creation process.
 * @returns {Object} newUser - The newly created user object. Sent in the response on success.
 * 
 */

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

/**
 * Update a user's info, by username
 *
 * @function
 * @name updateUser
 * @param {Object} req - Express request object with parameters: Username.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} - A Promise that resolves when the user update process is complete.
 * @throws {Error} - If there is an unexpected error during the process or if permission is denied.
 * @fires {Object} updatedUser - The updated user object sent in the response on success.
 * @description
 *   Expects at least one updatable field (username, password, email, birthday) in the request body.
 */

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

/**
 * Add a movie to a user's list of favorites
 *
 * @function
 * @name addFavoriteMovies
 * @param {Object} req - Express request object with parameters: Username, movieID.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} - A Promise that resolves when the movie addition process is complete.
 * @throws {Error} - If there is an unexpected error during the process or if permission is denied.
 * @returns {Object} updatedUser - The updated user object (including the added movie) sent in the response on success.
 */


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

/**
 * Delete a movie from a user's list of favorites
 *
 * @function
 * @name deleteFavoriteMovie
 * @param {Object} req - Express request object with parameters: Username, MovieID.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} - A Promise that resolves when the movie removal process is complete.
 * @throws {Error} - If there is an unexpected error during the process or if permission is denied.
 * @fires {Object} updatedUser - The updated user object (after removing the movie) sent in the response on success.
 */

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
    
/**
 * Delete a user by username
 *
 * @function
 * @name deleteUser
 * @param {Object} req - Express request object with parameters: Username.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} - A Promise that resolves when the user deletion process is complete.
 * @throws {Error} - If there is an unexpected error during the process or if permission is denied.
 * @fires {string} message - A message indicating the result of the user deletion process.
 */


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



