const mongoose = require('mongoose');
const gym = require('../models/gym');
const cities = require('./cities')
const LoremIpsum = require("lorem-ipsum").LoremIpsum;

// Lorem generator for description
const lorem = new LoremIpsum({
    sentencesPerParagraph: {
      max: 8,
      min: 4
    },
    wordsPerSentence: {
      max: 16,
      min: 4
    }
});


// Connect to the MongoDB Database using mongoose
mongoose.connect('mongodb://localhost:27017/Lyft', {
    useNewUrlParser: true, 
    useCreateIndex: true,
    useUnifiedTopology: true
});


const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log("Database Connection Succesfull")
});


const seedDB = async () => { 
    await gym.deleteMany({})
    console.log("Cleared the Database")
    for(let i = 0; i < 100; i++){ 
        const randCityindex = Math.floor(Math.random() * 1000)
        const cityname = cities[randCityindex].city

        const title_string = cityname + " Fitness Gym"
        const priceNum = Math.floor(Math.random() * 3)
        const ratingNumber = Math.floor(Math.random() * 10)
        const description = lorem.generateSentences(10);
        const locationstring = cities[randCityindex].city + ', ' +cities[randCityindex].state
        const imageCollectionURl = "https://source.unsplash.com/collection/11398809"
        
        const seedData = new gym({
            title: title_string,
            price: priceNum,
            rating: ratingNumber,  
            description: description, 
            location: locationstring,
            image: imageCollectionURl
        })
        await seedData.save()

    }  
    console.log("Populated the Data")
    
}

seedDB().then(() => { 
    db.close();
})
