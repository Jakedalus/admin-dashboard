require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const authRouter = require('./routes/auth');

mongoose.connect(process.env.MONGODB_URI, {
	useNewUrlParser    : true,
	useUnifiedTopology : true,
	useFindAndModify   : false,
	useCreateIndex     : true
});

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRouter);

// app.get('/', (req, res) => {
// 	res.send('<h1>Hello World!!</h1>');
// });

app.listen(process.env.PORT, () => {
	console.log(`Server running on port ${process.env.PORT}`);
});
