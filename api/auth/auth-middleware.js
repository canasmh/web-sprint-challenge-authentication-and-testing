const db = require('../../data/dbConfig');
const bcrypt = require('bcrypt');


function checkBodyParams(req, res, next) {
    if (!req.body.username || !req.body.password) {
        console.log('username or password missing')
        res.status(400).end("username and password required");
    } else {
        console.log('username and password provided')
        next();
    }
}

async function checkUniqueUsername(req, res, next) {
    const username = req.body.username;
    const user = await db('users').where({username: username}).first();

    if (user) {
        console.log('user is taken')
        res.status(400).end("username taken");
    } else {
        console.log('user is not taken')
        next();
    }
}

async function checkCredentials(req, res, next) {
    const { username, password } = req.body;
    const user = await db('users').where({username: username}).first();

    if (!(user && bcrypt.compareSync(password, user.password))) {
        res.status(400).end("invalid credentials")
    } else {
        next();
    }
}

module.exports = {
    checkBodyParams,
    checkUniqueUsername,
    checkCredentials
}