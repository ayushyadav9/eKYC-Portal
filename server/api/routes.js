const express = require("express");
const router = express.Router();
const passport = require('passport');
const { notFound,home } = require("./controllers/home");
const { register, login, getClientData, request } = require("./controllers/userController");


router.get('/', home)
router.post('/register',register)
router.post('/login',login)
router.get('/getClientData', passport.authenticate('jwt', { session:false }), getClientData)
router.post('/request', passport.authenticate('jwt', { session:false }), request)


router.get('*', notFound)


module.exports = router;