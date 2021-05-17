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

beforeEach(async () => {
	// Initialize Users
	await User.deleteMany({});

	let userObj = new User(initialUsers[0]);
	const user1 = await userObj.save();

	userObj = new User(initialUsers[1]);
	const user2 = await userObj.save();

	// console.log(`user1`, user1);
	// console.log(`user2`, user2);
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
