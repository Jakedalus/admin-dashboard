require('dotenv').config();
const http = require('http');
const express = require('express');
require('express-async-errors');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const authRouter = require('./routes/auth');
const coursesRouter = require('./routes/courses');
const middleware = require('./utils/middleware');

mongoose.connect(process.env.MONGODB_URI, {
	useNewUrlParser    : true,
	useUnifiedTopology : true,
	useFindAndModify   : false,
	useCreateIndex     : true
});

console.log(
	JSON.parse(
		JSON.stringify({
			title     : 'Sample Course 3',
			teacher   : 'Sample Teacher 3',
			subject   : 'Sample Subject 3',
			questions : [
				{
					question : 'Question 1?',
					answer   : 'Answer 1'
				},
				{
					question : 'Question 2?',
					answer   : 'Answer 2'
				},
				{
					question : 'Question 3?',
					answer   : 'Answer 3'
				}
			]
		})
	)
);

app.use(cors());
app.use(express.json());
app.use(middleware.tokenExtractor);

app.use('/api/auth', authRouter);
app.use('/api/courses', coursesRouter);

// app.get('/', (req, res) => {
// 	res.send('<h1>Hello World!!</h1>');
// });

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

const server = http.createServer(app);

server.listen(process.env.PORT, () => {
	console.log(`Server running on port ${process.env.PORT}`);
});
