const db = require('../../data/dbConfig');


function checkBodyParams(req, res, next) {
    if (!req.body.username || !req.body.password) {
        console.log('username or password missing')
        res.status(400).send('username and password required');
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
        res.status(400).send('username taken');
    } else {
        console.log('user is not taken')
        next();
    }
}

module.exports = {
    checkBodyParams,
    checkUniqueUsername
}