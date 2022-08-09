const User = require('../models/user')
const {body, validationResult} = require('express-validator')
const bcrypt = require('bcryptjs')

const getHomePage = (req, res) => {
    res.render('index', {title: 'Express', user: req.user})
}

const getSignInForm = (req, res) => {
    res.render('sign_in', {title: 'Sign In Form'})
}

const getSignUpForm = (req, res) => {
    res.render('sign_up', {title: 'Sign Up Form'})
}


const postSignUpForm = [
    body('username').trim().isLength({
        min: 6,
        max: 15
    }).escape().withMessage('Usernames have to be longer than 6 characters and shorter than 15!'),
    body('password').trim().isLength({min: 8}).withMessage('A password needs a length of at least 8.'),
    body('first').trim().escape().isLength({min: 1}).withMessage('Please enter a first name'),
    body('last').trim().escape().isLength({min: 1}).withMessage('Please enter a last name.'),
    async (req, res, next) => {
        try {
            const result = validationResult(req)
            if (!result.isEmpty()) { res.redirect('/sign-up')}
            const existing = await User.findOne({userName: req.body.username})
            if (existing) { return next()}
            const hashedPass = await bcrypt.hash(req.body.password, 10)
            await new User({
                userName: req.body.username,
                password: hashedPass,
                firstName: req.body.first,
                lastName: req.body.last,
                membership: false,
                admin: false,
                creationDate: new Date()
            }).save()
            res.redirect('/sign-in')
        } catch (e) {return next(e)}
    }]

const getSignOut = (req, res) => {
    req.logout(
        () => {res.redirect('/')})
}


module.exports = {getSignOut, getHomePage, getSignInForm, getSignUpForm, postSignUpForm}