
const express = require('express')
const user = express.Router()
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')
const mysql = require('mysql')
const crypto = require('crypto')
const salt = 'csv!9ay$gksv9v71$scuhx$o(tzfy=ds-6d!=$fkrt^sczln0m'
const secret_key_token = 'api_guvery'
// Body parser
user.use(bodyParser.urlencoded({ extended: false }))

function hash_pbkdf2(password) {
    try {
        return crypto.pbkdf2Sync(password, salt, 1000, 45, 'sha512').toString('hex').substring(0, 45)
    } catch (err) {
        return err
    }
}

user.get('/user', ensureToken, (req, res) => {
    var hola = hash_pbkdf2('asdasdasd')
    res.send(hola)
})

user.post('/login', (req, res) => {
    var mai = req.body.mai
    var pwd = req.body.pwd
    const user = { mai  : mai }
    var token = jwt.sign({user}, secret_key_token)
    if (mai !== "" && mai !== undefined && pwd !== "" && pwd !== undefined) {
        const connection = getConnection()
        const queryString = "SELECT * FROM USUARIOS WHERE mai = ?"
        connection.query(queryString, [mai], (err, rows, fiedl) => {
            if (hash_pbkdf2(pwd) === rows[0].pwd) {
                var usuario = rows.map((usuario) => {
                    return {
                        'id': usuario.idu,
                        'nombre': usuario.nombre,
                        'apellido': usuario.apellido,
                        'mai': usuario.mai,
                        'tokem': token
                    }
                })
                res.render('/home')
            }  
        })
    } else {
        res.redirect('/')
    }
})

user.get('/home', ensureToken, (req, res) => {
    var data = {
        data: "Hola mundo"
    }
    res.json(data)
})

// Conexion database
const  pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'semana10',
    port: 8889
})

function getConnection() {
    return pool
}

function ensureToken(req, res, next){
    const bearerHeader = req.headers["authorization"];
    if (typeof bearerHeader !== undefined && bearerHeader !== "") {
        
        const bearer = bearerHeader.split(" ")
        const bearerToken = bearer[1]
        req.token = bearerToken
        next()
    } else {
        res.sendStatus(403)
    }
}

module.exports = user