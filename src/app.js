
import express from 'express';
import __dirname from './utils.js';
import cookieParser from 'cookie-parser';
import handlebars from 'express-handlebars';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import sessionRouter from './routers/session.router.js';
import mongoose from 'mongoose';
import passport from 'passport';
import initializePassport from './config/passport.config.js';
import dotenv from 'dotenv'
try {
    dotenv.config();
} catch (error) {
    console.log('error');
}

const app = express();
app.use(cookieParser());

app.listen(8080, () => console.log('en el aire'));
app.use(express.static(__dirname + '/public'));

app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');

mongoose.connect(process.env.URL_MONGODB);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({

    store: MongoStore.create({
        mongoUrl: process.env.URL_MONGODB,
        //ttl: 15,//sino esta este parametro del tiempo de vida de la session por default dura 2 semanas
    }),

    secret: 'asd3ñc3okasod',
    resave: false,
    saveUninitialized: false

}));

initializePassport();
app.use(passport.initialize());
app.use(passport.session());



app.use('/api/sessions', sessionRouter);
