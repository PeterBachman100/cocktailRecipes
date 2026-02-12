// @desc Get current user profile
// @route GET /api/users/me
// @access Private

const getUserProfile = async (req, res) => {
    if (req.user) {
        res.json({
            user: {
                _id: req.user._id,
                username: req.user.username,
                role: req.user.role,
            }
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

module.exports = { getUserProfile };