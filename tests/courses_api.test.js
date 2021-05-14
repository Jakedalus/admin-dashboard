const mongoose = require('mongoose');
const supertest = require('supertest');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = require('../app');

const api = supertest(app);
const User = require('../models/user');
const initialUsers = [
	{
		username     : 'francis',
		name         : 'Frank Grimes',
		email        : 'frank.grimes@gmail.com',
		passwordHash : 'abcd1234',
		_id          : '609eea9a38af2f0a45b4f831',
		courses      : [ '5ff8e97be70f49b594daa4a6' ]
	},
	{
		username     : 'susan',
		name         : 'Sue Jones',
		email        : 'sue.jones@gmail.com',
		passwordHash : 'abcd1234',
		_id          : '609eea9a38af2f0a45b4f832',
		courses      : [ '5a422a851b54a676234d17f7' ]
	}
];

const Course = require('../models/course');
const initialCourses = [
	{
		title     : 'Sample Course',
		teacher   : 'Ms. Jones',
		subject   : 'Physics',
		user      : '609eea9a38af2f0a45b4f832',
		_id       : '5a422a851b54a676234d17f7',
		questions : [
			{
				question : 'question1',
				answer   : 'answer1'
			},
			{
				question : 'question2',
				answer   : 'answer2'
			}
		]
	},
	{
		title     : 'Sample Course 2',
		teacher   : 'Mr. Smith',
		subject   : 'Literature',
		user      : '609eea9a38af2f0a45b4f831',
		_id       : '5ff8e97be70f49b594daa4a6',
		questions : [
			{
				question : 'question1',
				answer   : 'answer1'
			},
			{
				question : 'question2',
				answer   : 'answer2'
			},
			{
				question : 'question3',
				answer   : 'answer3'
			}
		]
	}
];

let token;

beforeEach(async () => {
	// Initialize Users
	await User.deleteMany({});

	// const saltRounds = 10;
	// let passwordHash = await bcrypt.hash(
	// 	password,
	// 	saltRounds
	// );

	let userObj = new User(initialUsers[0]);
	const user1 = await userObj.save();

	userObj = new User(initialUsers[1]);
	const user2 = await userObj.save();

	// console.log(`user1`, user1);
	// console.log(`user2`, user2);

	// Initialize Courses
	await Course.deleteMany({});

	let courseObj = new Course(initialCourses[0]);
	const course1 = await courseObj.save();

	courseObj = new Course(initialCourses[1]);
	const course2 = await courseObj.save();

	// console.log(`course1`, course1);
	// console.log(`course2`, course2);

	// Login francis and get token
	const user = await User.findOne({
		username : 'francis'
	});

	const userForToken = {
		username : user.username,
		id       : user._id
	};

	token = jwt.sign(userForToken, process.env.SECRET);

	// console.log('token', token);
});

describe('course api tests', () => {
	test('courses are returned as json', async () => {
		// console.log(`app`, app);
		// console.log(`api`, api);

		const response = await api
			.get('/api/courses')
			.expect(200)
			.expect('Content-Type', /application\/json/);

		// console.log(`response.body`, response.body);
	});

	test('there are two courses', async () => {
		const response = await api.get('/api/courses');

		expect(response.body).toHaveLength(2);
	});

	test('courses should have an "id" property', async () => {
		const response = await api.get('/api/courses');

		// console.log(response.body);

		expect(response.body[0].id).toBeDefined();
	});

	test('new course should be added to the database', async () => {
		const newCourse = {
			title     : 'Sample Course 3',
			teacher   : 'Mr. Fredrick',
			subject   : 'Math',
			user      : '609eea9a38af2f0a45b4f831',
			_id       : '5ff8e97be79f43b594daa4a6',
			questions : [
				{
					question : 'question1',
					answer   : 'answer1'
				},
				{
					question : 'question2',
					answer   : 'answer2'
				},
				{
					question : 'question3',
					answer   : 'answer3'
				}
			]
		};

		await api
			.post('/api/courses')
			.set('Authorization', 'Bearer ' + token)
			.send(newCourse)
			.expect(201)
			.expect('Content-Type', /application\/json/);

		const response = await api.get('/api/courses');

		console.log(`response.body`, response.body);

		const contents = response.body.map(r => r.title);

		expect(response.body).toHaveLength(3);
		expect(contents).toContain('Sample Course 3');
	});

	describe('deletion of a course', () => {
		test('succeeds with status code 200 if id is valid', async () => {
			const coursesAtStart = await api.get('/api/courses');
			console.log(
				`coursesAtStart.body`,
				coursesAtStart.body
			);
			const courseToDelete = coursesAtStart.body[1];

			console.log('courseToDelete', courseToDelete);

			await api
				.delete(`/api/courses/${courseToDelete.id}`)
				.set('Authorization', 'Bearer ' + token)
				.expect(200);

			const coursesAtEnd = await api.get('/api/courses');

			console.log('coursesAtEnd.body', coursesAtEnd.body);

			expect(coursesAtEnd.body).toHaveLength(
				coursesAtStart.body.length - 1
			);

			const titles = coursesAtEnd.body.map(r => r.title);

			expect(titles).not.toContain(courseToDelete.title);
		});

		test('sfails with status code 400 if user is not authorized', async () => {
			const coursesAtStart = await api.get('/api/courses');
			console.log(
				`coursesAtStart.body`,
				coursesAtStart.body
			);
			const courseToDelete = coursesAtStart.body[0];

			const id = mongoose.Types.ObjectId();

			console.log('courseToDelete', courseToDelete);

			await api
				.delete(`/api/courses/${courseToDelete.id}`)
				.set('Authorization', 'Bearer ' + token)
				.expect(400);

			const coursesAtEnd = await api.get('/api/courses');

			console.log('coursesAtEnd.body', coursesAtEnd.body);

			expect(coursesAtEnd.body).toHaveLength(
				coursesAtStart.body.length
			);

			const titles = coursesAtEnd.body.map(r => r.title);

			expect(titles).toContain(courseToDelete.title);
		});
	});

	describe('update a course', () => {
		test('succeeds with status code 204 and updated course if id is valid', async () => {
			const coursesAtStart = await api.get('/api/courses');

			const courseToUpdate = coursesAtStart.body[1];

			// console.log('courseToUpdate', courseToUpdate);

			const newCourse = {
				...courseToUpdate,
				user  : initialUsers[1]._id, // expects populated user field unless this is included
				title : 'Brand New Title'
			};

			const updatedCourse = await api
				.put(`/api/courses/${courseToUpdate.id}`)
				.set('Authorization', 'Bearer ' + token)
				.send(newCourse)
				.expect(200);

			// console.log(`newCourse`, newCourse);
			// console.log(
			// 	`updatedCourse.body`,
			// 	updatedCourse.body
			// );

			delete newCourse.user;
			delete updatedCourse.body.user;
			delete newCourse.updatedAt;
			delete updatedCourse.body.updatedAt;

			expect(updatedCourse.body).toEqual(newCourse);
		});

		test('fails with status code 400 because of invalid user', async () => {
			const coursesAtStart = await api.get('/api/courses');

			const courseToUpdate = coursesAtStart.body[0];

			const newCourse = {
				...courseToUpdate,
				user  : initialUsers[0]._id,
				title : 'Brand New Title'
			};

			console.log('newCourse', newCourse);

			const updatedCourse = await api
				.put(`/api/courses/${courseToUpdate.id}`)
				.set('Authorization', 'Bearer ' + token)
				.send(newCourse)
				.expect(400);

			console.log('updatedCourse.body', updatedCourse.body);

			expect(updatedCourse.body).toEqual({});
		});
	});
});

afterAll(() => {
	mongoose.connection.close();
});
