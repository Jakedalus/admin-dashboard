const usersRouter = require('express').Router();
const User = require('../models/user');

usersRouter.get('/', async (req, res) => {
	const users = await User.find({}).populate('courses');

	res.json(users);
});

module.exports = usersRouter;
