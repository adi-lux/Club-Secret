const Message = require('../models/message')
const User = require('../models/user')
const {body, validationResult} = require('express-validator')
const bcrypt = require('bcryptjs')

const getHomePage = async (req, res, next) => {
    res.render('index', {title: 'Express'})
}

const getSignInForm = async (req, res, next) => {
    res.render('sign_in', {title: 'Sign In Form'})
}

const getSignUpForm = async (req, res, next) => {
    res.render('sign_up', {title: 'Sign Up Form'})
}

const postSignUpForm = async (req, res, next) => {
    try {
        const hashedPass = await bcrypt.hash(req.body.password, 10)
        await new User({
            username: req.body.username,
            password: hashedPass,
            firstName: req.body.first,
            lastName: req.body.last,
            email: req.body.email,
            membership: false,
            creationDate: new Date()
        }).save()

        res.render('sign_in')
    } catch (e) {return next(e)}
}

const getSignOut = async (req, res, next) => {
    try {
        await req.logout()
        res.redirect('/')
    } catch (e) { return next(e)}
}


module.exports = {getSignOut, getHomePage, getSignInForm, getSignUpForm , postSignUpForm}