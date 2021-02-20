const express = require('express');
const path = require('path');
const methodOverride = require('method-override');
const engine = require('ejs-mate')
const mongoose = require('mongoose');
const Gym = require('./models/gym');

//------------------------------------//
//              Database              //
//------------------------------------//




// Connect to the MongoDB Database using mongoose
mongoose.connect('mongodb://localhost:27017/hoopbuddy', {
    useNewUrlParser: true, 
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false

});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log("Database Connection Succesfull")
});

// Start Express app
const app = express(); 



//------------------------------------//
//              Configuration         //
//------------------------------------//

app.engine('ejs', engine)
// Set the view engine to EJS
app.set('view engine', 'ejs'); 
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true}))
app.use(methodOverride('_method'));



//------------------------------------//
//              Views                 //
//------------------------------------//


// This is the home page for our app
app.get('/', (req,res) => { 
    res.render('home')
})

// Serve the main page where you can view all gyms on site
app.get('/gyms', async (req,res) => { 
    // Get all of the gyms that have been stored in the db
    const gyms = await Gym.find({})
    res.render('gyms/gyms', { gyms })
})

app.post('/gyms', async (req,res) => { 
    const gym = new Gym(req.body)
    await gym.save();
    res.redirect(`/gyms/${gym._id}`)
})

// Server the template needed for creating a new gym entry
app.get('/gyms/new', async (req,res) => { 
    res.render('gyms/new')
})

// Serve the show template for each of the gyms
app.get('/gyms/:id', async (req,res) => { 
    id = req.params.id
    const gym = await Gym.findById(id)
    res.render('gyms/show', {gym})
})

app.get('/gyms/:id/edit', async (req,res) => { 
    id = req.params.id
    const gym = await Gym.findById(id)
    res.render('gyms/edit', {gym})
})

app.put('/gyms/:id', async (req, res) => { 
    const { id } = req.params;
    const gym = await Gym.findByIdAndUpdate(id, {...req.body.gym})
    res.redirect(`/gyms/${gym._id}`)
})

app.delete('/gyms/:id', async (req, res) => { 
    const { id } = req.params;
    await Gym.findByIdAndDelete(id);
    res.redirect('/gyms');
})

app.listen(3000, () => { 
    console.log('Serving app on port 3000');
})

// Example for how to add something to the database
// app.get('/makegym', async (req,res) => { 
//     const gym = new Gym({ 
//         title: 'Ymca',
//         price: 0,
//         rating: 5, 
//         description: "There is a full gym basketball gym at the Ymca.", 
//         location: "Gravenhurst"})
//     await gym.save();
//     res.send(gym)
// })