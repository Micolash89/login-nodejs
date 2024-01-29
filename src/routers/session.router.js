import { Router } from 'express';
import UserDB from './../DAO/managersDB/userDB.js';
import { createHash, isValidPassword } from '../utils.js';
import passport from 'passport';


const sessionRouter = Router();

const userDB = new UserDB();

sessionRouter.get('/login', (req, res) => {

    console.log(req.session.errorData);

    res.render('login', (!req.session.errorData) ? { style: 'login.css' } : req.session.errorData);
});

sessionRouter.get('/github', passport.authenticate('github', { scope: ['user:email'] }), async (req, res) => {
    res.render('perfil', { profile: req.session.user });
});

sessionRouter.get('/githubcallback', passport.authenticate('github', { failureRedirect: '/login' }), async (req, res) => {
    req.session.user = req.user;
    console.log('session', req.session.user);
    res.redirect('/api/sessions/perfil');
});

// sessionRouter.post('/login', async (req, res) => {

//     try {
//         const { email, password } = req.body;

//         const user = await userDB.findEmail(email);

//         if (user) {

//             if (!isValidPassword(user, password)) return res.render('login', { status: false });

//             delete user.password;
//             req.session.user = user;
//             console.log(user);

//             return res.render('perfil', { status: true, profile: user });
//         }

//         return res.render('perfil', { status: false });

//     } catch (error) {
//         console.log('error');
//         res.status(500).render('login', {});
//     }

// });

sessionRouter.post('/login', passport.authenticate('login', { failureRedirect: '/api/sessions/faillogin' }), async (req, res) => {

    if (!req.user) return res.status(400).send({ status: 'error', message: 'error user' });
    // return res.render('login', req.errorData);


    req.session.user = {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        age: req.user.age,
        email: req.user.email
    }

    res.render('perfil', { status: true, profile: req.session.user });

});

sessionRouter.get('/faillogin', (req, res) => {

    req.session.errorData = { error: true, style: 'login.css' };
    console.log(req.session.errorData);

    res.redirect('/api/sessions/login')

    //res.redirect('/api/sessions/login', { error: true, style: 'login.css' });
});



sessionRouter.get('/perfil', (req, res) => {

    res.render('perfil', (req.session.user) ? { status: true, profile: req.session.user } : { status: false });

});

sessionRouter.get('/registrar', (req, res) => {

    res.render('registrar', { style: 'login.css' });

});


sessionRouter.post('/registrar', passport.authenticate('registrar', { failureRedirect: '/failregistrar' }), async (req, res) => {

    res.render('registrar', { status: true, style: 'login.css' });

});

sessionRouter.get('/failregistrar', async (req, res) => {
    console.log("fail Strategy");
    res.status(500).render('registrar', { status: false, message: error.message });
});

sessionRouter.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.json({ status: 'Logout ERROR', body: err });
        }
        res.send('Logout ok!');
    });
});


function auth(req, res, next) {

    if (req.session?.email === 'nn@nn') {
        return next();
    }
    return res.status(401).send('error de autorización!');
}

sessionRouter.get('/privado', auth, (req, res) => {
    res.send('si estas viendo esto es porque ya te logueaste!')
});


sessionRouter.get('/restorepassword', async (req, res) => {

    res.render('RestorePassword', { style: 'login.css' });

});

sessionRouter.post('/restorepassword', async (req, res) => {

    try {
        const { email, password } = req.body;

        const user = await userDB.findEmail(email);

        if (user) {

            console.log('antes ', user.password);
            user.password = createHash(password);

            console.log('despues ', user.password);

            const resp = await userDB.updateUser(user);

            res.render('login', { style: 'login.css' });

        }

    } catch (error) {
        return res.status(401).send({ status: 'error', message: error });
    }

});



export default sessionRouter;