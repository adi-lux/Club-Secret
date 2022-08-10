const User = require('../models/user')
const Message = require('../models/message')
const {body, validationResult} = require('express-validator')
const bcrypt = require('bcryptjs')
const passport = require("passport");

const getHomePage = async (req, res, next) => {
    try {
        const messageList = await Message.find({}).sort({timestamp: -1}).populate('creator').exec()
        res.render('index', {title: 'Club Secret', user: req.user, messageList: messageList})
    } catch (e) {return next(e)}
}

const getSignInForm = (req, res) => {
    res.render('sign_in', {title: 'Sign In Form'})
}

const getSignUpForm = (req, res) => {
    res.render('sign_up', {title: 'Sign Up Form'})
}

const getMembershipForm = (req, res) => {
    res.render('membership', {title: 'Membership Form'})
}


const postMembershipForm = async (req, res, next) => {
    try {
        if (req.body.passcode === process.env.CODE) {
            await User.findByIdAndUpdate(req.user.id, {membership: true})
            res.redirect('/')
        } else {
            res.redirect('/membership')
        }
    } catch (e) { return next(e)}
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

const getMessagesForm = (req, res) => {
    res.render('message_form', {title: 'Post Message Form'})
}

const postMessagesForm = [
    body('title').trim(),
    body('content').trim(),
    async (req, res, next) => {
        try {
            const result = validationResult(req)
            if (!result.isEmpty()) { res.redirect('/sign-up')}
            const existing = await User.findById(req.user.id).exec()
            await new Message({
                title: req.body.title,
                content: req.body.content,
                creator: existing,
                timestamp: new Date()
            }).save()
            res.redirect('/')
        } catch (e) {return next(e)}
    }]

const getUpdateMessageForm = async (req, res, next) => {
    try {
        const existing = await Message.findById(req.params.id).exec()
        res.render('message_update', {url: existing.url, title: existing.title, content: existing.content})
    } catch (e) {return next(e)}
}

const postUpdateMessageForm = [
    body('title').trim(),
    body('content').trim(),
    async (req, res, next) => {
        try {
            await Message.findByIdAndUpdate(req.params.id,
                {
                    title: req.body.title,
                    content: req.body.content,
                }).exec()
            res.redirect('/')
        } catch (e) {return next(e)}
    }]

const deleteMessage = async (req, res, next) => {
    try {
        const message = await Message.findById(req.params.id).populate('creator').exec()
        await console.log(req.user.id, message.creator.id, message.title, message.content, 'deleted')
        if (req.user.id !== message.creator.id && !req.user.admin) { return res.redirect('/') }
        await Message.findByIdAndDelete(req.params.id)
        res.redirect('/')
    } catch (e) {return next(e)}
}

const postSignInForm = (req, res, next) => {
    return passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/sign-in"
    })
}

const getAdmin = async (req, res, next) => {
    if (!req.user) {return res.redirect('/')}
    await User.findByIdAndUpdate(req.user.id, {admin: !req.user.admin})
    res.redirect('/')
}

const errorPage = (req, res, next) => res.render('404', {title: '404'})
const randomPage = (req, res, next) => res.redirect('404')
module.exports = {
    postSignInForm,
    getMessagesForm,
    postMessagesForm,
    getMembershipForm,
    postMembershipForm,
    getSignOut,
    getHomePage,
    getSignInForm,
    getSignUpForm,
    postSignUpForm,
    postUpdateMessageForm,
    getUpdateMessageForm,
    deleteMessage,
    getAdmin,
    errorPage, randomPage
}