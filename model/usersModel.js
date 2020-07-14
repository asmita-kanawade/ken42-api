const mongoose = require('mongoose');

const usersSchema = new mongoose.Schema({
	name: {
        type: String
	},
	dob: {
        type: Date
    },
    rollNumber: {
        type: Number
    },
    phoneNumber: {
        type: Number,
        required:true,
        unique:true
    },
    isAdmin: {
        type: Boolean,
        required:true
	}
})

module.exports = mongoose.model('users',usersSchema, `ken42-users`);