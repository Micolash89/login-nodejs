import passport from "passport";
import local from 'passport-local';
import UserDB from "../DAO/managersDB/userDB.js";
import { createHash, isValidPassword } from "../utils.js";
import GitHubStrategy from 'passport-github2';

const userDB = new UserDB();

const LocalStrategy = local.Strategy;

const initializePassport = () => {

    passport.use("github", new GitHubStrategy({
        clientID: process.env.CLI_ID,
        clientSecret: process.env.CLI_SECRET,
        callbackURL: "http://localhost:8080/api/sessions/githubcallback"
    }, async (accessToken, refreshToken, profile, done) => {

        try {

            let user = await userDB.findEmail(profile._json.email);
            if (!user) {
                console.log(profile);
                let newUser = {
                    first_name: profile._json.name,
                    last_name: "",
                    age: 18,
                    email: profile._json.email,
                    password: ""
                }
                let result = await userDB.createOne(newUser);
                done(null, result);
            }

            else {
                done(null, user);
            }

        } catch (error) {
            return done(error);
        }

    }));


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

    }));





    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        let user = await userDB.getOneId(id);
        done(null, user);
    });

    passport.use('login', new LocalStrategy({ usernameField: 'email' }, async (username, password, done) => {
        try {
            const user = await userDB.findEmail(username);
            if (!user) {
                console.log('el usuario no existe ');
                return done(null, false);
            }

            console.log(isValidPassword(user, password));
            if (!isValidPassword(user, password)) return done(null, false);
            console.log(username);

            return done(null, user);

        } catch (error) {
            return done(error);
        }
    }));
}

export default initializePassport;