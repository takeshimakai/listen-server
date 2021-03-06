import 'dotenv/config';

import express from 'express';
import passport from 'passport';
import cors from 'cors';
import http from 'http';

import socket from './socket.io/socket.js';
import connectMongoDB from './config/mongoDB.js';

import authRouter from './routes/auth.js';
import usersRouter from './routes/users.js';
import postsRouter from './routes/posts.js';
import commentsRouter from './routes/comments.js';
import friendsRouter from './routes/friends.js';

const app = express();
const server = http.createServer(app);

app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(passport.initialize());

app.use('/api/auth', authRouter);
app.use('/api/users', passport.authenticate('jwt', { session: false }), usersRouter);
app.use('/api/posts', passport.authenticate('jwt', { session: false }), postsRouter);
app.use('/api/comments', passport.authenticate('jwt', { session: false }), commentsRouter);
app.use('/api/friends', passport.authenticate('jwt', { session: false }), friendsRouter);

connectMongoDB();
socket(server);
server.listen(process.env.PORT, () => console.log('listening!'));