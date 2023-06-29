// require express/morgan in the 'index.js' file
const express = require('express');
    const app = express();
    // const morgan = require('morgan');

    // app.use(morgan('common'));

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

// Express GET route
app.get('/movies', (req, res) => {
    res.json(topMovies);
});

// Express GET route located at endpoint '/'
app.get('/', (req, res) => {
    res.send('Welcome to my top 10 movies!')
});


// Listen for requests
app.listen(8080, () => {
    console.log('Your app is listening on port 8080')
});

// Use express.static to serve 'documentation.html' file from public folder
app.use('/documentation.html', express.static('public'));

// Error-handling function
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!')
})