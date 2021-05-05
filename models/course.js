const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
	title   : String,
	teacher : String,
	subject : String,
	user    : {
		type : mongoose.Schema.Types.ObjectId,
		ref  : 'User'
	}
});

courseSchema.set('toJSON', {
	transform : (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString();
		delete returnedObject._id;
		delete returnedObject.__v;
	}
});

module.exports = mongoose.model('Course', courseSchema);
