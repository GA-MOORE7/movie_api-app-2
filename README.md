# Movie API Documentation

#### This API provides information about movies, genres, and directors. Users can interact with the API to retrieve details about movies, genres, directors, create new users, and manage their favorite movies.

## Table of Contents

### <a href="#endpoints">Endpoints</a>

- #### <a href="#bullet-1">1. Get All Movies</a>

- #### <a href="#bullet-2">2. Get Movie by ID</a>

- #### <a href="#bullet-3">3. Get Genre Description</a>

- #### <a href="#bullet-4">4. Get Director by Name</a>

- #### <a href="#bullet-5">5. Create New User</a>

- #### <a href="#bullet-6">6. Update User Details</a>

- #### <a href="#bullet-7">7. Add Movie to User's Favorites</a>

- #### <a href="#bullet-8">8. Remove Movie from User's Favorites</a>

- #### <a href="#bullet-9">9. Delete User</a>

# <h3 href="#endpoints">Endpoints</h3>

## <h3 href="#bullet-1">1. Get All Movies</h3>

<p>
    <strong>Request:
    </strong>
</p>
<ul>
<li> Method: <code>Get</code></li>
<li> URL: <code>/movies</code></li>
<li> Request Body: None</li>
</ul>

## <h3 href="#bullet-2">2. Get Movie by ID</h3>

<p>
    <strong>Request:
    </strong>
</p>
<ul>
<li> Method: <code>Get</code></li>
<li> URL: <code>/movies</code></li>
<li> Request Body: None</li>
</ul>

<p>
    <strong>Response:
    </strong>
</p>
<ul>
<li> Format: JSON</li>
<li> Description: </li>
</ul>

## <h3 href="#bullet-3">3. Get Genre Description</h3>

<p>
    <strong>Request:
    </strong>
</p>
<ul>
<li> Method: <code>Get</code></li>
<li> URL: <code>/movies</code></li>
<li> Request Body: None</li>
</ul>

<p>
    <strong>Response:
    </strong>
</p>
<ul>
<li> Format: JSON</li>
<li> Description: </li>
</ul>

## <h3 href="#bullet-4">4. Get Director by Name</h3>

<p>
    <strong>Request:
    </strong>
</p>
<ul>
<li> Method: <code>Get</code></li>
<li> URL: <code>/movies</code></li>
<li> Request Body: None</li>
</ul>

<p>
    <strong>Response:
    </strong>
</p>
<ul>
<li> Format: JSON</li>
<li> Description: </li>
</ul>

## <h3 href="#bullet-5">5. Create New User</h3>

<p>
    <strong>Request:
    </strong>
</p>
<ul>
<li> Method: <code>Get</code></li>
<li> URL: <code>/movies</code></li>
<li> Request Body: None</li>
</ul>

<pre>
                        {
                            "Username": "gamoore7",
                            "Password": "bookbinder6",
                            "Email": "gerald.moore42@gmail.com",
                            "Birth": "1989-12-18T00:00:00.000Z",
                            "FavoriteMovies": [],
                            "_id": "64bc52d58bf19d6302425352",
                            "__v": 0
                        }
                    </pre>

<p>
    <strong>Response:
    </strong>
</p>
<ul>
<li> Format: JSON</li>
<li> Description: </li>
</ul>

## <h3 href="#bullet-6">6. Update User Details</h3>

<p>
    <strong>Request:
    </strong>
</p>
<ul>
<li> Method: <code>Get</code></li>
<li> URL: <code>/movies</code></li>
<li> Request Body: None</li>
</ul>

<p>
    <strong>Response:
    </strong>
</p>
<ul>
<li> Format: JSON</li>
<li> Description: </li>
</ul>

## <h3 href="#bullet-7">7. Add Movie to User's Favorites</h3>

<p>
    <strong>Request:
    </strong>
</p>
<ul>
<li> Method: <code>Get</code></li>
<li> URL: <code>/movies</code></li>
<li> Request Body: None</li>
</ul>

<p>
    <strong>Response:
    </strong>
</p>
<ul>
<li> Format: JSON</li>
<li> Description: </li>
</ul>

## <h3 href="#bullet-8">8. Remove Movie from User's Favorites</h3>

<p>
    <strong>Request:
    </strong>
</p>
<ul>
<li> Method: <code>Get</code></li>
<li> URL: <code>/movies</code></li>
<li> Request Body: None</li>
</ul>

<p>
    <strong>Response:
    </strong>
</p>
<ul>
<li> Format: JSON</li>
<li> Description: </li>
</ul>

## <h3 id ="bullet-9">9. Delete User</h3>

<p>
    <strong>Request:
    </strong>
</p>
<ul>
<li> Method: <code>Get</code></li>
<li> URL: <code>/movies</code></li>
<li> Request Body: None</li>
</ul>

<p>
    <strong>Response:
    </strong>
</p>
<ul>
<li> Format: JSON</li>
<li> Description: </li>
</ul>

## Technologies

- #### Node.js
- #### Express.js
- #### MongoDB with Mongoose
- #### bcrypt
- #### body-parser
- #### cors
- #### express-validator
- #### jsonwebtoken
- #### lodash
- #### passport
- #### passport-jwt
- #### passport-local
- #### uuid

## Getting Started

#### 1. Install dependencies: npm install

#### 2. Start the server: npm start or for development with nodemon: npm run dev
