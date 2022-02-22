//BUILDING THE SERVER
require('dotenv').config()
const express = require('express');
const cors = require('cors');
const app = express();
const path = require('path') 

const {SERVER_PORT} = process.env
const {seed, getRecipe, postRecipe, deleteRecipe } = require('./controller.js')

//MIDDLEWARE
app.use(cors());
app.use(express.json());
app.use(express.static('public'));



// CREATE DB WITH SENDING POST http://localhost:4005/api/seed TO POSTMEN
app.post('/seed', seed)

// ENDPOINTS
app.get('/api/recipes', getRecipe)
app.post('/api/recipes', postRecipe)
app.delete('/api/recipes/:meal_id', deleteRecipe)

// Set up home route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname , '../public/index.html'))
  });




// const port = process.env.PORT || 4005

// app.listen(port, () => {
//   console.log(`Listening on port ${port}`)
// })

// const port = process.env.SERVER_PORT || 4005 //for heroku only

app.listen(process.env.PORT || 4040, 
	() => console.log("Server is running..."));