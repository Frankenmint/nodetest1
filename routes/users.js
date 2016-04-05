var express = require('express');
var router	= express.Router();

// get user list
router.get('/userlist', function(req, res) {
	var db = req.db
	var collection = db.get('userlist')
	collection.find({}, {}, function (e, docs) {
		res.json(docs)
	})
})

// post users
router.post('/adduser', function (req, res) {
	var db = req.db
	var collection = db.get('userlist')
	collection.insert(req.body, function (err, result) {
		res.send(
			(err === null) ? { msg: '' } : { msg: err }
		)
	})
})
// delete users
router.delete('/deleteuser/:id', function (req, res) {
	var db					 = req.db
		,	collection	 = db.get('userlist')
		,	userToDelete = req.params.id
	collection.remove({ '_id' : userToDelete }, function (err) {
		res.send((err === null) ? { msg: '' } : { msg: 'Error: ' + err })
	})
})

module.exports = router;
