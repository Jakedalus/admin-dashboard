const router = require('express').Router();
const Course = require('../models/course');
const User = require('../models/user');

router.post('/reset', async (request, response) => {
	await Course.deleteMany({});
	await User.deleteMany({});

	response.status(204).end();
});

module.exports = router;
