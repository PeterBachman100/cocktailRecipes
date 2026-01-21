const User = require('../models/User');
const jwt = require('jsonwebtoken');

// @desc Register a new user
// @route POST /api/auth/register
// @access Public

const registerUser = async (req, res) => {
    const {username, password} = req.body;

    try {
        const userExists = await User.findOne({username});

        if (userExists) {
            return res.status(400).json({message: 'User already exsts'});
        }

        const user = await User.create({
            username,
            password
        });

        if(user) {
            res.status(201).json({
                _id: user._id,
                username: user.username,
                message: 'User registered successfully.'
            });
        }
    } catch(error) {
        console.error(error);
        res.status(500).json({message: 'Server error during registration', error: error.message});
    }
};

module.exports = { registerUser };