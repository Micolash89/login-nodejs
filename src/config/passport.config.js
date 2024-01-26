import passport from "passport";
import local from 'passport-local';
import UserDB from "../DAO/managersDB/userDB.js";
import { createHash, isValidPassword } from "../utils.js";

const userDB = new UserDB();

const LocalStrategy = local.Strategy;

const initializePassport = () => {


    passport.use('registrar', new LocalStrategy({ passReqToCallback: true, usernameField: 'email' }, async (req, username, password, done) => {

        const user1 = req.body;

        try {
            let user2 = await userDB.findEmail(username);

            if (user2) {

                console.log('existe el ussuario');
                return done(null, false);
            }

            user1.password = createHash(req.body.password);

            const resp = await userDB.createOne(user1);

            return done(null, resp);

        } catch (error) {

            return done('error al obtener el usuario: ' + error);

        }

    }))

    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        let user = await userDB.getOne(id);
        done(null, user);
    })


    passport.use('login', new LocalStrategy({ usernameField: 'email' }, async (username, password, done) => {
        try {
            const user = await userDB.findEmail(username);
            if (!user) {
                console.log('el usuario no existe ');
                return done(null, false);
            }

            if (!isValidPassword(user, password)) return done(null, false);

            return done(null, user);

        } catch (error) {
            return done(error);
        }
    }))
}

export default initializePassport;