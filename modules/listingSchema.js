const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
  name: String,
  summary: String,
  bedrooms: Number,
  bathrooms: Number,
});

const Listing = mongoose.model('Listing', listingSchema, 'listingsAndReviews');

module.exports = Listing;