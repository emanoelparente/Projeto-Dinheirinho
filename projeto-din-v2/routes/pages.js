const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('cadastro');
});

/*router.get('/cadastro', (req, res) =>{
    res.render('cadastro');
})*/

router.get('/login', (req, res) => {
    res.render('login')
})

router.get('/home', (req, res) => {
    res.render('home')
})



module.exports = router;