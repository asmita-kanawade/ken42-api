const mongoose = require('mongoose');

const applicationsSchema = new mongoose.Schema({
    userID:{
        type: String,
        required:true
    },
	name: {
        type: String,
        required: true
	},
	phoneNumber: {
        type: Number,
        required: true
    },
    gender: {
        type: String
    },
    mother_name: {
        type: String
    },
    father_name: {
        type: String
    },
    email:{
        type: String
    },
    communication_address:{
        type: String
    },
    address_line1:{
        type: String
    },
    address_line2:{
        type: String
    },
    is_default_address:{
        type:Boolean
    },
    is_draft:{
        type:Boolean,
        required:true
    },
    access_code:{
        type: String,
        required:true
    },
    current_step:{
        type: String,
        required:true
    }
})

module.exports = mongoose.model('applications',applicationsSchema, `ken42-applications`);