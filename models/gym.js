const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Creating a schema for each basketball court
const gymSchema = new Schema({ 
    title: String,
    price: Number,
    rating: Number, 
    description: String, 
    location: String,
    image: String
});

// Export the schema as a model that can be used elsewhere
module.exports = mongoose.model('gym', gymSchema)
