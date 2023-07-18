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
// const { join } = require('path');

    
// json object of users
    // let users = [
    //     {
    //         id: 1,
    //         name: "Gerald",
    //         favoriteMovies: ["Lord of the Rings"]
    //     },
    //     {
    //         id: 2,
    //         name: "Kim",
    //         favoriteMovies: ["The Mission"]
    //     }
    // ]
    
//  json object of my top 10 movies:
//     let movies = [
//     {
//         "Title": "Lord of the Rings",
//         "Description": "A saga of a group of sometimes reluctant heroes who set forth to save their world from consummate evil.",
//         "Genre": {
//             "Name": "Fantasy",
//             "Description": "a genre of speculative fiction involving magical elements, typically set in a fictional universe and usually inspired by mythology and folklore."
//         },
//         "Director": {
//             "Name": "Peter Jackson",
//             "Bio": "Sir Peter Jackson was born in Pukerua Bay Wellington in 1961. He began making movies at an early age using his parents' Super 8 camera. He left school at 17 and began shooting a science fiction comedy short, which three years later had grown into a 75-minute feature called Bad Taste.",
//             "Birth": 1961 
//         },
//     },
//     {
//         "Title": "The Mission",
//         "Description": "Jesuit priest Father Gabriel (Jeremy Irons) enters the Guarani lands in South America with the purpose of converting the natives to Christianity",
//         "Genre": {
//             "Name": "Adventure",
//             "Description": "The adventure genre is defined by having a strong element of danger in the story. Adventure stories are fast-paced and full of action"
//         },
//         "Director": {
//             "Name": "Roland Joffe",
//             "Bio": "Roland Joffé was born on November 17, 1945 in London, England, UK. He is a producer and director, known for The Mission (1986), The Killing Fields (1984) and The Great Hunger.",
//             "Birth": 1945 
//         },
//     },
//     {
//         "Title": "The Ghost and the Darkness",
//         "Description": "A bridge engineer and an experienced old hunter begin a hunt for two lions after they start attacking local construction workers.",
//         "Genre": {
//             "Name": "Thriller",
//             "Description": "a genre of fiction with numerous, often overlapping, subgenres, including crime, horror and detective fiction. "
//         },
//         "Director": {
//             "Name": "Stephen Hopkins",
//             "Bio": "Stephen Hopkins is a producer and director, known for Lost in Space (1998), A Nightmare on Elm Street: The Dream Child (1989) and Predator 2 (1990). ",
//             "Birth": 1958 
//         },
//     },
//     {
//         "Title": "Testament of Youth",
//         "Description": "Testament of Youth is a powerful coming-of-age story which tackles love, war, loss and remembrance. It's based on the beloved WW1 memoir by Vera Brittain.",
//         "Genre": {
//             "Name": "Historal Drama",
//             "Description": "Historical drama may include mostly fictionalized narratives based on actual people or historical events"
//         },
//         "Director": {
//             "Name": "James Kent",
//             "Bio": "James Kent is a British television and film director. He directed the feature films Testament of Youth and The Aftermath and the TV dramas The White Queen and The Secret Diaries of Miss Anne Lister.",
//             "Birth": 1962 
//         },
//     },
//     {
//         "Title": "The Land Before Time",
//         "Description": "A young Apatosaurus named Littlefoot ends up alone after his mother is attacked by a vicious Tyrannosaurus rex and dies. Littlefoot flees famine and upheaval to search for the Great Valley.",
//         "Genre": {
//             "Name": "Animation",
//             "Description": "An animated film is defined as a motion picture in which movement and characters' performances are created using a frame-by-frame technique"
//         },
//         "Director": {
//             "Name": "Don Bluth",
//             "Bio": "Don Bluth was one of the chief animators at Disney to come to the mantle after the great one's death. He eventually became the animation director for such films as The Rescuers (1977) and Pete's Dragon (1977). ",
//             "Birth": 1937 
//         },
//     },
// ];

// Morgan middleware library to log all requests
let myLogger = (req, res, next) => {
    console.log(req.url);
    next();
};

app.use(myLogger);

// Serves a “documentation.html” file using express.static;
// app.use(express.static(join(__dirname, 'public'))); 

// app.get('/documentation.html', (req, res) => {
//     res.sendFile(join(__dirname, 'public', 'documentation.html'));
// });

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

