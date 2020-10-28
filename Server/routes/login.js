const jwt = require("jwt-then");
const config = require("../config/default");

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
router.post('/', async (req, res, next) => {
    passport.authenticate('localLogin', {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true,
        successFlash: true,


    })


        (req, res, next)
}
);
router.get('/test', async (req, res) => {
    res.json(
        req.user.username
    )


});
router.get('/jwt', require('connect-ensure-login').ensureLoggedIn(), async (req, res) => {
    const token = await jwt.sign({ id: req.user.id }, config.server.secret);

    res.json({
        message: "User logged in successfully!",
        token,
    });
});

module.exports = router;

