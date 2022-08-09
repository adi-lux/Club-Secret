const express = require('express');
const router = express.Router();
const homeController = require('../controllers/home-controller')

router.get('/', homeController.getHomePage)
router.post('/', homeController.postMessagesForm)
router.get('/sign-up', homeController.getSignUpForm)
router.post('/sign-in', homeController.postSignInForm());
router.post('/sign-up', homeController.postSignUpForm)
router.get('/sign-in', homeController.getSignInForm)
router.get('/sign-out', homeController.getSignOut)
router.get('/membership', homeController.getMembershipForm)
router.post('/membership', homeController.postMembershipForm)
router.get('/messages', homeController.getMessagesForm)
router.get('/messages/:id', homeController.getUpdateMessageForm)
router.post('/messages/:id', homeController.postUpdateMessageForm)
router.post('/delete/messages/:id', homeController.deleteMessage)
router.get(process.env.ADMIN_ROUTE, homeController.getAdmin)
router.get('/404', homeController.errorPage)
router.get('*', homeController.randomPage)

module.exports = router;