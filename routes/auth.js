const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { response } = require('express');
const authRouter = require('express').Router();
const validator = require('validator');
const User = require('../models/user');

authRouter.post('/signup', async (req, res) => {
	const { username, password, email, name } = req.body;

	// console.log(`username, password`, username, password);

	if (!username || !password) {
		res.status(400).json({
			error : 'must include username and password'
		});
	}

	if (!email) {
		res.status(400).json({
			error : 'must include an email'
		});
	}

	if (!validator.isEmail(email)) {
		res.status(400).json({
			error : 'not a valid email'
		});
	}

	if (!name) {
		res.status(400).json({
			error : 'must include your name'
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
		passwordHash,
		name,
		email
	});

	const savedUser = await user.save();

	const userForToken = {
		username,
		id       : user._id
	};

	const token = jwt.sign(userForToken, process.env.SECRET);

	console.log(`savedUser`, savedUser);

	res.status(200).json({
		username  : savedUser.username,
		name      : savedUser.name,
		email     : savedUser.email,
		createdAt : savedUser.createdAt,
		_id       : savedUser._id,
		token
	});
});

authRouter.post('/signin', async (req, res) => {
	const { username, password } = req.body;

	const user = await User.findOne({
		username
	});

	const passwordCorrect =
		user === null
			? false
			: await bcrypt.compare(password, user.passwordHash);

	if (!user || !passwordCorrect) {
		return res.status(401).json({
			error : 'invalid username or password'
		});
	}

	const userForToken = {
		username,
		id       : user._id
	};

	const token = jwt.sign(userForToken, process.env.SECRET);

	const { name, email } = user;

	res.status(200).send({
		token,
		username,
		name,
		email
	});
});

authRouter.put('/changepassword', async (req, res) => {
	const { username, password, newPassword } = req.body;

	if (!username || !newPassword) {
		res.status(400).json({
			error : 'must include username and password'
		});
	}

	if (username.length < 3 || newPassword.length < 8) {
		res.status(400).json({
			error : 'username and/or password is not long enough'
		});
	}

	const user = await User.findOne({
		username
	});

	const passwordCorrect =
		user === null
			? false
			: await bcrypt.compare(password, user.passwordHash);

	if (!user || !passwordCorrect) {
		return res.status(401).json({
			error : 'invalid password'
		});
	}

	const saltRounds = 10;
	const passwordHash = await bcrypt.hash(
		newPassword,
		saltRounds
	);

	await User.findByIdAndUpdate(user.id, { passwordHash });

	// const userForToken = {
	// 	username,
	// 	id       : user._id
	// };

	// const token = jwt.sign(userForToken, process.env.SECRET);

	// const { name, email } = user;

	res.status(200).end();
});

module.exports = authRouter;
