
const express = require('express')
const app = express()
const user = require('./controller/user')

app.set('view engine', 'ejs')
app.use(user)

app.get('/', (req, res) => {
    res.render('./login')
})

app.listen(3000, () => {
    console.log("Start service")
})
