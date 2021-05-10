const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema(
	{
		title     : {
			type      : String,
			minlength : 3,
			required  : true
		},
		teacher   : String,
		subject   : String,
		questions : [
			{
				// _id      : false,
				question : { type: String, required: true },
				answer   : { type: String, required: true }
			}
		],
		user      : {
			type : mongoose.Schema.Types.ObjectId,
			ref  : 'User'
		}
	},
	{ timestamps: true }
);

courseSchema.set('toJSON', {
	transform : (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString();
		delete returnedObject._id;
		delete returnedObject.__v;
	}
});

module.exports = mongoose.model('Course', courseSchema);
