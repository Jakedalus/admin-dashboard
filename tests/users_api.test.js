const mongoose = require('mongoose');
const supertest = require('supertest');
const bcrypt = require('bcrypt');
const app = require('../app');

const api = supertest(app);
const User = require('../models/user');
const initialUsers = [
	{
		username     : 'francis',
		name         : 'Frank Grimes',
		email        : 'frank.grimes@gmail.com',
		passwordHash : 'abcd1234',
		_id          : '609eea9a38af2f0a45b4f831'
		// courses      : [ '5ff8e97be70f49b594daa4a6' ]
	},
	{
		username     : 'susan',
		name         : 'Sue Jones',
		email        : 'sue.jones@gmail.com',
		passwordHash : 'abcd1234',
		_id          : '609eea9a38af2f0a45b4f832'
		// courses      : [ '5a422a851b54a676234d17f7' ]
	}
];

// const Course = require('../models/course');
// const initialCourses = [
// 	{
// 		title     : 'Sample Course',
// 		teacher   : 'Ms. Jones',
// 		subject   : 'Physics',
// 		user      : '609eea9a38af2f0a45b4f832',
// 		_id       : '5a422a851b54a676234d17f7',
// 		questions : [
// 			{
// 				question : 'question1',
// 				answer   : 'answer1'
// 			},
// 			{
// 				question : 'question2',
// 				answer   : 'answer2'
// 			}
// 		]
// 	},
// 	{
// 		title     : 'Sample Course 2',
// 		teacher   : 'Mr. Smith',
// 		subject   : 'Literature',
// 		user      : '609eea9a38af2f0a45b4f831',
// 		_id       : '5ff8e97be70f49b594daa4a6',
// 		questions : [
// 			{
// 				question : 'question1',
// 				answer   : 'answer1'
// 			},
// 			{
// 				question : 'question2',
// 				answer   : 'answer2'
// 			},
// 			{
// 				question : 'question3',
// 				answer   : 'answer3'
// 			}
// 		]
// 	}
// ];

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
	// await Course.deleteMany({});

	// let courseObj = new Course(initialCourses[0]);
	// const course1 = await courseObj.save();

	// courseObj = new Course(initialCourses[1]);
	// const course2 = await courseObj.save();

	// console.log(`course1`, course1);
	// console.log(`course2`, course2);
});

describe('user api tests', () => {
	test('users are returned as json', async () => {
		// console.log(`app`, app);
		// console.log(`api`, api);

		const response = await api
			.get('/api/users')
			.expect(200)
			.expect('Content-Type', /application\/json/);

		// console.log(`response.body`, response.body);
	});

	test('there are two users', async () => {
		const response = await api.get('/api/users');

		expect(response.body).toHaveLength(2);
	});

	test('attempt to create user with non-unique username fails', async () => {
		const usersAtStart = await User.find({});

		const newUser = {
			username : 'francis',
			name     : 'Jacob A. Carpenter',
			email    : 'frank.grimes@gmail.com',
			password : 'another sekret'
		};

		await api
			.post('/api/auth/signup')
			.send(newUser)
			.expect(400)
			.expect('Content-Type', /application\/json/);

		const usersAtEnd = await User.find({});

		expect(usersAtEnd).toHaveLength(usersAtStart.length);
	});
});

afterAll(() => {
	mongoose.connection.close();
});
