// require express/morgan in the 'index.js' file
const express = require('express');
    morgan = require('morgan');

    const app = express(); 
       
    app.use(morgan('common'));

    const PORT = 8080;     
    
// Serves a “documentation.html” file using express.static;
    app.use(express.static('public'));

//  json object of my top 10 movies:
    let topMovies = [
    {
        title: 'Lord of the Rings',
    },
    {
        title: 'The Mission',
    },
    {
        title: 'The Ghost and the Darkness',
    },
    {
        title: 'Testament of Youth',
    },
    {
        title: 'The Land Before Time',
    },
    {
        title: 'The Time Machine',
    },
    {
        title: 'The Reluctant Convert',
    },
    {
        title: 'Gladiator',
    },
    {
        title: 'The Last Samurai',
    },
    {
        title: 'Pig',
    }
];

// Morgan middleware library to log all requests
let myLogger = (req, res, next) => {
    console.log(req.url);
    next();
};

app.use(myLogger);

// Express GET route
app.get('/movies', (req, res) => {
    res.json(topMovies);
});

// Express GET route located at endpoint '/'
app.get('/', (req, res) => {
    res.send('Welcome to my top 10 movies!')
});

// Log all requests using Morgan:
app.get('/secreturl', (req, res) => {
    res.send('This is a secret url with super top-secret content.');
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

