const coursesRouter = require('express').Router();
const Course = require('../models/course');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

coursesRouter.get('/', async (req, res) => {
	const courses = await Course.find({}).populate('user');

	res.json(courses);
});

coursesRouter.post('/', async (req, res) => {
	console.log(`req.body`, req.body);

	if (!req.token) {
		return res
			.status(401)
			.json({ error: 'token missing or invalid' });
	}

	const decodedToken = jwt.verify(
		req.token,
		process.env.SECRET
	);

	if (!decodedToken) {
		return res
			.status(401)
			.json({ error: 'token missing or invalid' });
	}

	const user = await User.findById(decodedToken.id);

	const course = new Course({ ...req.body, user });

	console.log(`course`, course);

	if (!course.title) {
		res
			.status(400)
			.json({ error: 'a course title is required' });
	} else {
		const newCourse = await course.save();
		console.log(`newCourse`, newCourse);
		user.courses = user.courses.concat(newCourse._id);
		await user.save();

		res.status(201).json(newCourse);
	}
});

coursesRouter.delete('/:id', async (req, res) => {
	const decodedToken = jwt.verify(
		req.token,
		process.env.SECRET
	);

	if (!req.token || !decodedToken) {
		return res
			.status(401)
			.json({ error: 'token missing or invalid' });
	}

	const user = await User.findById(decodedToken.id);

	const courseToDelete = await Course.findById(
		req.params.id
	);

	console.log(`user`, user);
	console.log(`courseToDelete`, courseToDelete);

	if (
		user._id.toString() === courseToDelete.user.toString()
	) {
		const deletedCourse = await Course.findByIdAndRemove(
			req.params.id
		);

		console.log(`deletedCourse`, deletedCourse);

		if (deletedCourse) {
			res.status(200).json(deletedCourse);
		} else {
			res.status(400).end();
		}
	} else {
		res.status(400).end();
	}
});

module.exports = coursesRouter;
