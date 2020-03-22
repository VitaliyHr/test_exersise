const { Router } = require('express');
const auth = require('../middlewares/auth');
const Ctrl = require('../controllers/profile.controller');

const router = Router();

//зміна avatara
router.post('/', auth, Ctrl.Profile);


module.exports = router;
