const { Router } = require('express');
const User = require('../models/user');
const auth = require('../middlewares/auth');
const avatar = require('../middlewares/avatar');
const Ctrl = require('../controllers/profile.controller')

const router = Router();

router.get('/', (req, res) => {

});


//зміна avatara
router.post('/', auth, Ctrl.Profile);


module.exports = router;
