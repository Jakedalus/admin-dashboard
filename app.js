require('dotenv').config();
const express = require('express');
require('express-async-errors');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const authRouter = require('./routes/auth');
const coursesRouter = require('./routes/courses');
const usersRouter = require('./routes/users');
const middleware = require('./utils/middleware');

const MONGODB_URI =
	process.env.NODE_ENV === 'test'
		? process.env.TEST_MONGODB_URI
		: process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI, {
	useNewUrlParser    : true,
	useUnifiedTopology : true,
	useFindAndModify   : false,
	useCreateIndex     : true
});

app.use(cors());
app.use(express.json());
app.use(middleware.tokenExtractor);

app.use('/api/auth', authRouter);
app.use('/api/courses', coursesRouter);
app.use('/api/users', usersRouter);

if (process.env.NODE_ENV === 'test') {
	console.log('NODE_ENV', process.env.NODE_ENV);
	const testingRouter = require('./routes/reset');
	app.use('/api/testing', testingRouter);
}

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
