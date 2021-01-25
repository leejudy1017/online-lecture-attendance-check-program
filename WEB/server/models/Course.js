const mongoose = require('mongoose');

const courseSchema = mongoose.Schema({
	campus: {
		type: String,
	},
	major: {
		type: String,
	},
	year: {
		type: String,
	},
	class: {
		type: String,
	},
	course: {
		type: String,
	},
	prof: {
		type: String,
	},
	students: {
		type: Array,
	},
	key: {
		type: Number,
		unique: true,
	},
	update: {
		type: String,
	},
});

const Course = mongoose.model('Course', courseSchema);

module.exports = { Course };
