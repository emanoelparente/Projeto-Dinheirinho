const express = require('express');
const router = express.Router();

const lancamentoController = require("../controllers/lancamentoController");

/*router.get('/', (req, res) => {
    res.render('cadastro');
});

router.get('/login', (req, res) => {
    res.render('login')
})

router.get('/home', (req, res) => {
    res.render('home')
})


/*-----------------------------------*/

router.get("/teste", (req, res) => {
    const resposta = lancamentoController.buscar();
    res.send(resposta);
});

/*router.post("/teste", (req, res) => {
    res.send("Chegou aqui, estamos criando um novo lançamentos...");
});

router.put("/teste/:id", (req, res) => {
    const { id } = req.params;
    res.send(`Chegou aqui, estamos atualizando o lançamento ${id}...`);
});

router.delete("/teste/:id", (req, res) => {
    const { id } = req.params;
    res.send(`Chegou aqui, estamos deletando o lançamento ${id}...`);
});*/

module.exports = router;