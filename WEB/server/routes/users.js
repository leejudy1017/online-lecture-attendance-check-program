const express = require('express');
const router = express.Router();
const { User } = require('../models/User');

const { auth } = require('../middleware/auth');

//=================================
//             User
//=================================

router.post('/professor', (req, res) => {
	User.findOne({ _id : req.body.id }, (err, user) => {
		if(err) return res.json({success:false,err})
		return res.json({success: true, info:user})
})
})


router.get('/auth', auth, (req, res) => {
	res.status(200).json({
		_id: req.user._id,
		isAdmin: req.user.role === 0 ? false : true,
		isAuth: true,
		email: req.user.email,
		name: req.user.name,
		studentId: req.user.studentId,
		role: req.user.role,
		major: req.user.major
	});
});

router.post('/register', (req, res) => {
	const user = new User(req.body);

	user.save((err, doc) => {
		if (err) return res.json({ success: false, err });
		return res.status(200).json({
			success: true,
		});
	});
});

router.post('/login', (req, res) => {
	User.findOne({ email: req.body.email }, (err, user) => {
		if (!user)
			return res.json({
				loginSuccess: false,
				message: '이메일 또는 비밀번호가 틀렸습니다.',
			});

		if (user.role == 1)
			return res.json({
				loginSuccess: false,
				message: '인증이 필요합니다.',
			});

		user.comparePassword(req.body.password, (err, isMatch) => {
			if (!isMatch)
				return res.json({ loginSuccess: false, message: '이메일 또는 비밀번호가 틀렸습니다.' });

			user.generateToken((err, user) => {
				if (err) return res.status(400).send(err);
				res.cookie('w_authExp', user.tokenExp);
				res.cookie('w_auth', user.token).status(200).json({
					loginSuccess: true,
					userId: user._id,
				});
			});
		});
	});
});

router.get('/logout', auth, (req, res) => {
	User.findOneAndUpdate({ _id: req.user._id }, { token: '', tokenExp: '' }, (err, doc) => {
		if (err) return res.json({ success: false, err });
		return res.status(200).send({
			success: true,
		});
	});
});

module.exports = router;
