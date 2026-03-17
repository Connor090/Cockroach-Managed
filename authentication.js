const passport = require('passport');
const User = require('../models/user');

// Register a new user
const register = async (req, res) => {
    // Validate message to ensure that all data was provided
    if (!req.body.name || !req.body.email || !req.body.password) {
        return res
            .status(400)
            .json({ "message": "All fields required" });
    }

    // Create a new user record
    const user = new User();
    user.name = req.body.name;
    user.email = req.body.email;
    user.setPassword(req.body.password);

    const q = await user.save();

    if (!q) { // Database returned no data
        return res
            .status(400)
            .json(err);
    } else {
        // Return newly created record with JWT
        const token = user.generateJWT();
        return res
            .status(200)
            .json({ token });
    }
};

// Login an existing user
const login = (req, res) => {
    // Validate message to ensure that email and password are present
    if (!req.body.email || !req.body.password) {
        return res
            .status(400)
            .json({ "message": "All fields required" });
    }

    // Delegate authentication to passport module
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            // Error in Authentication Process
            return res
                .status(404)
                .json(err);
        }
        if (user) {
            // Auth succeeded - generate JWT and return to caller
            const token = user.generateJWT();
            res
                .status(200)
                .json({ token });
        } else {
            // Auth failed return error
            res
                .status(401)
                .json(info);
        }
    })(req, res);
};

// Export methods that drive endpoints
module.exports = {
    register,
    login
};