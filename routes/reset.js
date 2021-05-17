const router = require('express').Router();
const Course = require('../models/course');
const User = require('../models/user');

// route to use during NODE_ENV=testing to reset the test database, clear it of courses and users
router.post('/reset', async (request, response) => {
	await Course.deleteMany({});
	await User.deleteMany({});

	response.status(204).end();
});

module.exports = router;
