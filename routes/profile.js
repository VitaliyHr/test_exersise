const { Router } = require('express');
const User = require('../models/user');
const auth = require('../middlewares/auth');
const avatar = require('../middlewares/avatar');

const router = Router();

router.get('/', (req, res) => {

});


//зміна avatara
router.post('/', auth, async (req, res) => {
  try {
    const { id } = req.body;
    const user = await User.findById(id);
    if (!user) {
      return res.status(400).json('no such user');
    }
    if (req.files) {
      return await avatar(req, res, user);
    }

    await user.save();
    return res.status(400).json(user);
  }
  catch (e) {
    console.log(e);
  }
});


module.exports = router;
