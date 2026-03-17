const mongoose = require('mongoose');
const Trip = mongoose.model('trips');

// GET all trips
const tripsList = async (req, res) => {
    try {
        const trips = await Trip.find({});
        return res.status(200).json(trips);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

// GET single trip by code
const tripsFindByCode = async (req, res) => {
    try {
        const tripCode = req.params.tripCode;
        const trip = await Trip.findOne({ code: tripCode });

        if (!trip) {
            return res.status(404).json({ message: "Trip not found" });
        }

        return res.status(200).json(trip);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

// POST: /trips - Adds a new Trip
const tripsAddTrip = async (req, res) => {
    console.log('POST trip');
    console.log(req.body);

    const newTrip = new Trip({
        code: req.body.code,
        name: req.body.name,
        length: req.body.length,
        start: req.body.start,
        resort: req.body.resort,
        perPerson: req.body.perPerson,
        image: req.body.image,
        description: req.body.description
    });

    try {
        const q = await newTrip.save();
        return res.status(201).json(q);
    } catch (err) {
        return res.status(400).json(err);
    }
};



const tripsUpdateTrip = async (req, res) => {
    console.log(req.params);
    console.log(req.body);

    const q = await Trip
        .findOneAndUpdate(
            { 'code': req.params.tripCode },
            {
                code: req.body.code,
                name: req.body.name,
                length: req.body.length,
                start: req.body.start,
                resort: req.body.resort,
                perPerson: req.body.perPerson,
                image: req.body.image,
                description: req.body.description
            }
        )
        .exec();

    if (!q) {
        return res.status(400).json(err);
    } else {
        return res.status(201).json(q);
    }
};


module.exports = {
    tripsList,
    tripsFindByCode,
    tripsAddTrip,
    tripsUpdateTrip
};


