const mongoose = require('mongoose');
const Listing = require('./listingSchema');

let connectionString = '';

const initialize = (connString) => {
    return new Promise((resolve, reject) => {
        connectionString = connString;
        mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true })
            .then(() => {
                console.log('Connected to MongoDB');
                resolve();
            })
            .catch((err) => {
                console.error('Error connecting to MongoDB:', err);
                reject(err);
            });
    });
};

const addNewListing = (data) => {
    return new Promise((resolve, reject) => {
        const newListing = new Listing(data);
        newListing.save()
            .then((listing) => {
                resolve(listing);
            })
            .catch((err) => {
                reject(err);
            });
    });
};

const getAllListings = (page, perPage, name) => {
    return new Promise((resolve, reject) => {
        let query = {};
        if (name) {
            query.name = { $regex: name, $options: 'i' };
        }

        page = parseInt(page) || 1;
        perPage = parseInt(perPage) || 10;

        Listing.find(query)
            .skip((page - 1) * perPage)
            .limit(perPage)
            .exec()
            .then((listings) => {
                if (listings.length === 0) {
                    console.log("No listings found with the given query.");
                }
                resolve(listings);
            })
            .catch((err) => {
                console.error("Error fetching listings:", err);
                reject(err);
            });
    });
};

const getListingById = (id) => {
    return Listing.findById(id).exec();
};

const updateListingById = (data, id) => {
    return Listing.findByIdAndUpdate(id, data, { new: true }).exec();
};

const deleteListingById = (id) => {
    return Listing.findByIdAndDelete(id).exec();
};

module.exports = {
    initialize,
    addNewListing,
    getAllListings,
    getListingById,
    updateListingById,
    deleteListingById
};