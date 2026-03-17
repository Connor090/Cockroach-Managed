const mongoose = require('./db');
const Trip = require('./travlr');
const fs = require('fs');

const tripsData = JSON.parse(
    fs.readFileSync('./data/trips.json', 'utf8')
);

Trip.deleteMany({})
    .then(() => {
        return Trip.insertMany(tripsData);
    })
    .then(() => {
        console.log("Database seeded successfully");
        mongoose.connection.close();
    })
    .catch(err => {
        console.log("Seeding error:", err);
        mongoose.connection.close();
    });
