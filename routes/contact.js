const express = require('express')
const router = express.Router()
const { ensureAuth } = require('../middleware/auth')
//@desc Developer Contact
//@routes GET /contact
router.get('/', ensureAuth, (req, res) => {
    res.render('contact/index', {
        fullName: req.user.displayName,
        image: req.user.image,
    })
})
module.exports = router