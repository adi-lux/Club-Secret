const express = require('express');
const router = express.Router();
const homeController = require('../controllers/home-controller')
const passport = require('passport')

router.get('/', homeController.getHomePage)
router.get('/sign-up', homeController.getSignUpForm)
router.get('/sign-in', homeController.getSignInForm)
router.get('/sign-out', homeController.getSignOut)
router.post('/sign-up', homeController.postSignUpForm)
router.post('/sign-in', passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/sign-in"
    })
);
module.exports = router;