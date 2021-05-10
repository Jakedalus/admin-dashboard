const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const validator = require('validator');

const userSchema = new mongoose.Schema(
	{
		username     : {
			type      : String,
			minlength : 3,
			required  : true,
			unique    : true
		},
		passwordHash : {
			type      : String,
			minlength : 8,
			required  : true
		},
		// userType       : String,
		name         : {
			type     : String,
			required : true
		},
		email        : {
			type     : String,
			required : true,
			unique   : true,
			validate : [ validator.isEmail, 'invalid email' ]
		},
		// gender         : String,
		// age            : Number,
		// educationLevel : String,
		// nativeLang     : String,
		// englishLevel   : String,
		courses      : [
			{
				type : mongoose.Schema.Types.ObjectId,
				ref  : 'Course'
			}
		]
	},
	{ timestamps: true }
);

userSchema.plugin(uniqueValidator);

userSchema.set('toJSON', {
	transform : (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString();
		delete returnedObject._id;
		delete returnedObject.__v;
		delete returnedObject.passwordHash;
	}
});

module.exports = mongoose.model('User', userSchema);
