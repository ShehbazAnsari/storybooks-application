const express = require('express')
const router = express.Router()
const passport = require('passport')

//@desc Auth With Google
//@routes GET /auth/google
router.get('/google', passport.authenticate('google', { scope: ['profile'] }))


//@desc Google Auth Callback
//@routes GET /auth/google/callback
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) => {
        res.redirect('/dashboard')

    })

//@desc Logout
//@routes GET /auth/logout
router.get('/logout', (req, res) => {
    req.logOut()
    res.redirect('/')
})

module.exports = router