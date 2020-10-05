const jwt = require("jwt-then");

const express = require('express'),
    router = express.Router(),
    passport = require('passport');

router.get('/',
    require('connect-ensure-login').ensureLoggedOut(),
    (req, res) => {
        res.render('login', {
            user: null,
            errors: {
                email: req.flash('email'),
                password: req.flash('password')
            }
        });
    });

// router.post('/', passport.authenticate('localLogin', {
//     successRedirect : '/',
//     failureRedirect : '/login',
//     failureFlash : true,

// }));
router.post('/', (req, res, next) => {
    passport.authenticate('localLogin', {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true
    })(req, res, next)
}
);


module.exports = router;

