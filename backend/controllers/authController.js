const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const jwt = require('jsonwebtoken');

// @desc Register a new user
// @route POST /api/auth/register
// @access Public

const registerUser = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.create({
            username,
            password
        });

        if (user) {
            res.status(201).json({
                user: {
                    _id: user._id,
                    username: user.username,
                    role: user.role, 
                },
                token: generateToken(user._id),
                message: 'User registered successfully.'
            });
        }
    } catch (error) {
        if (error.name === 'ValidationError') {
            const message = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({ message: message.join(', ') });
        }

        // Check for Duplicate Key Error (e.g., username already taken)
        if (error.code === 11000) {
            return res.status(400).json({ message: 'That username is already taken' });
        }

        console.error(error);
        res.status(500).json({ message: 'Server error during registration' });
    }
};


// @desc Auth user & get token
// @route POST /api/auth/login
const loginUser = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username }).select('+password');

        if (user && (await user.matchPassword(password))) {
            res.json({
                user: {
                    _id: user._id,
                    username: user.username,
                    role: user.role,
                },
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'Invalid username or password' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error during login'});
    }
};

const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (user) {
            res.status(200).json({
                username: user.username,
                role: user.role
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching profile' });
    }
};

module.exports = { registerUser, loginUser, getUserProfile };