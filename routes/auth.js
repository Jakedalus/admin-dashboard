const bcrypt = require('bcrypt');
const { response } = require('express');
const authRouter = require('express').Router();
const User = require('../models/user');

authRouter.post('/', async (req, res) => {
	const { username, password } = req.body;

	console.log(`username, password`, username, password);

	if (!username || !password) {
		res.status(400).json({
			error : 'must include username and password'
		});
	}

	if (username.length < 3 || password.length < 8) {
		res.status(400).json({
			error : 'username and/or password is not long enough'
		});
	}

	const saltRounds = 10;
	const passwordHash = await bcrypt.hash(
		password,
		saltRounds
	);

	const user = new User({
		username,
		passwordHash
	});

	const savedUser = await user.save();

	// console.log(`savedUser`, savedUser);

	res.status(200).json(savedUser);
});

module.exports = authRouter;
