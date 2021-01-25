const { PythonShell } = require('python-shell');
const express = require('express');
const router = express.Router();
const { User } = require('../models/User');
const { Course } = require('../models/Course');
const { Check } = require('../models/Check');
const { auth } = require('../middleware/auth');

const multer = require('multer');
//=================================
//             Data
//=================================

let storageVideo = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'uploads/embedding/');
	},
	filename: (req, file, cb) => {
		cb(null, `${req.body.studentid}.webm`);
	},
});

let storageImage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'uploads/card/');
	},
	filename: (req, file, cb) => {
		cb(null, `${Date.now()}_${file.originalname}`);
	},
});

let storageProf = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'uploads/professor/');
	},
	filename: (req, file, cb) => {
		cb(null, `${Date.now()}_${file.originalname}`);
	},
});

let storageAtt = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'uploads/verify/');
	},
	filename: (req, file, cb) => {
		cb(null, file.originalname);
	},
});

const uploadVideo = multer({ storage: storageVideo }).single('file');
const uploadImage = multer({ storage: storageImage }).single('file');
const uploadProf = multer({ storage: storageProf }).single('file');
const uploadAtt = multer({ storage: storageAtt }).single('file');

router.post('/uploadfile', (req, res) => {
	uploadVideo(req, res, (err) => {
		let options = {
			mode: 'text',
			pythonPath: '/usr/bin/python3',
			pythonOptions: ['-u'],
			args: [req.body.studentid, '/home/ubuntu/capstone-Web/' + res.req.file.path],
		};
		console.log(res.req.file.path);
		User.find({ studentId: req.body.studentid }, { course: 1 }).exec((err, data) => {
			console.log(data[0].course);
			if (err) return res.json({ success: false });
			for (key of data[0].course) {
				Course.findOneAndUpdate(
					{
						key: key,
					},
					{ $set: { update: '1' } }
				);
			}
		});
		User.findOneAndUpdate(
			{ studentId: req.body.studentid },
			{ $set: { video: res.req.file.path, update: '0' } },
			{
				new: true,
			},
			(err, userInfo) => {
				if (err) return res.json({ success: false, err });
				return res.status(200).send({ success: true, userInfo });
			}
		);
		PythonShell.run('/home/ubuntu/faceRecog/videoEmbedding.py', options, (err, result) => {
			if (err) console.log(err);
			console.log(result);
		});
	});
});

router.post('/manual', (req, res) => {
	console.log(req.body);
	Check.insertMany(JSON.parse(req.body.students), (err, info) => {
		if (err) return res.json({ success: false, err });
		return res.json({ success: true, info: info });
	});
});

router.post('/verify', (req, res) => {
	uploadAtt(req, res, (err) => {
		let options = {
			mode: 'text',
			pythonPath: '/usr/bin/python3',
			pythonOptions: ['-u'],
			args: [
				'/home/ubuntu/capstone-Web/' + res.req.file.path,
				req.body.key,
				req.body.week,
				req.body.finger,
				req.body.name,
			],
		};
		if (err) return res.json({ success: false, err });

		PythonShell.run('/home/ubuntu/faceRecog/chulCheck.py', options, (err, result) => {
			if (err) return res.json({ success: false, err });
			return res.status(200).send({ success: true, result: result });
		});
	});
});

router.post('/professor/image', (req, res) => {
	uploadProf(req, res, (err) => {
		if (err) return res.json({ success: false, err });
		return res.status(200).send({ success: true, filePath: res.req.file.path });
	});
});

const appkey = 'api key';

var fs = require('fs');
router.post('/studentcard', (req, res) => {
	let studentid = '';
	uploadImage(req, res, (err) => {
		let options = {
			mode: 'text',
			pythonPath: '/usr/bin/python3',
			pythonOptions: ['-u'],
			args: [res.req.file.path, appkey],
		};

		PythonShell.run(
			'/home/ubuntu/capstone-Web/server/python/kakao-ocr.py',
			options,
			(err, result) => {
				if (err) console.log(err);
				studentid = result[0];
				console.log(studentid);

				if (studentid.length == '') return res.json({ success: false });

				fs.rename(res.req.file.path, 'uploads/card/' + studentid + '.png', function (err) {
					console.log(res.req.file.filename + ' ' + res.req.file.path);
				});
				fs.rename(
					res.req.file.path.split('.')[0] + '-crop.png',
					'uploads/card/' + studentid + '-crop.png',
					function (err) {
						console.log(res.req.file.filename + ' ' + res.req.file.path);
					}
				);
				return res.status(200).send({
					success: true,
					filePath: 'uploads/card/' + studentid + '.png',
					studentid: studentid,
				});
			}
		);
	});
});

router.post('/update/idincourse', (req, res) => {
	let keys = [];
	User.find({ studentId: req.body.userId }, { course: 1 }).exec((err, info) => {
		for (let i of info[0].course) {
			keys.push(i.key);
		}
	});
	User.updateMany({ studentId: req.body.userId }, { $set: { course: [] } }).exec(() => {
		Course.updateMany(
			{},
			{ $pull: { students: { $in: [req.body.userId] } } },
			{ multi: true }
		).exec(() => {
			for (let key of keys) {
				if (!req.body.courses.includes(key)) {
					console.log(key);
					Course.findOneAndUpdate(
						{ key: key },
						{ $set: { update: '1' } },
						{
							new: true,
						},
						(err) => {
							if (err) return res.json({ success: false, err });
						}
					);
				}
			}

			for (let course of req.body.courses) {
				if (course in keys) {
					Course.findOneAndUpdate(
						{ _id: course._id },
						{ $set: { update: '1' }, $addToSet: { students: req.body.userId } }
					).exec();
				} else {
					Course.findOneAndUpdate(
						{ _id: course._id },
						{ $set: { update: '1' }, $addToSet: { students: req.body.userId } }
					).exec();
				}
				User.findOneAndUpdate(
					{ studentId: req.body.userId },
					{
						$addToSet: {
							course: course.key,
						},
					},
					{
						new: true,
					},
					(err, info) => {}
				);
			}
		});
	});

	//     if(err) return res.json({ success: false, err });
	// return res.status(200).send({success:true});
	setTimeout(() => {
		return res.status(200).send({ success: true });
	}, 2000);
});

router.post('/professor/courses', (req, res) => {
	Course.find({ prof: req.body.name, major: req.body.major }).exec((err, courseList) => {
		if (err) return res.status(400).json({ success: false, err });
		return res.status(200).json({ success: true, courseList });
	});
});

router.post('/check', (req, res) => {
	Check.find({ studentid: req.body.userId }, { studentid: 0 }).exec((err, checkList) => {
		console.log(checkList);
		if (err) return res.status(400).json({ success: false, err });
		return res.status(200).json({ success: true, checkList: checkList });
	});
});

router.post('/check', (req, res) => {
	Check.find({ studentid: req.body.userId }, { studentid: 0 }).exec((err, checkList) => {
		console.log(checkList);
		if (err) return res.status(400).json({ success: false, err });
		return res.status(200).json({ success: true, checkList: checkList });
	});
});

router.post('/check/professor', (req, res) => {
	let checkList = [];
	Course.find({ prof: req.body.name, major: req.body.major }, { _id: 0, key: 1, course: 1 }).exec(
		(err, courseList) => {
			if (err) return res.status(400).json({ success: false, err });
			for (course of courseList) {
				Check.find({ key: course.key }, { _id: 0 }).exec((err, result) => {
					checkList.push(result);
				});
			}
			setTimeout(() => {
				return res.json({ success: true, checkList });
			}, 2000);
		}
	);
});

router.get('/course', (req, res) => {
	Course.find().exec((err, courseInfo) => {
		if (err) return res.status(400).json({ success: false, err });
		return res.status(200).json({ success: true, courseInfo });
	});
});

module.exports = router;
