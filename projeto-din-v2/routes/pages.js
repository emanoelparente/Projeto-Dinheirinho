const express = require('express');
const router = express.Router();

const lancamentoController = require("../controllers/lancamentoController");

router.get('/', (req, res) => {
    res.render('cadastro');
});

router.get('/login', (req, res) => {
    res.render('login')
})

router.get('/home', (req, res) => {
    res.render('home')
})

/*-----------------------------------*/

router.get("/lancamentos", (req, res) => {
    const listaLancamentos = lancamentoController.buscar();
    listaLancamentos
        .then((lancamentos) => res.status(200).json(lancamentos))
        .catch((error) => res.status(400).json(error.message));
});

router.post("/lancamentos", (req, res) => {
    const novoLancamento = {
        Tipo_de_lançamento: req.body.tipo,
        Categoria: req.body.categoria,
        Forma: req.body.forma,
        Data_de_ocorrencia: req.body.data,
        Valor: req.body.valor,
        Descrição: req.body.descricao
    };

    lancamentoController.criar(novoLancamento)
        .then(lancamentoCriado => res.status(201).json(lancamentoCriado))
        .catch((error) => res.status(400).json(error.message));
});


/*router.post("/lancamentos", (req, res) => {
    const novoLancamento = req.body;
    const lancamento = lancamentoController.criar(novoLancamento);
    lancamento
        .then(lancamentoCriado => res.status(201).json(lancamentoCriado))
        .catch((error) => res.status(400).json(error.message));
});

router.post("/teste", (req, res) => {
    res.send("Formulario recebido")
})*/


router.put("/lancamentos/:id", (req, res) => {
    const { id } = req.params;
    const lancamentoAtualizado = req.body;
    const lancamento = lancamentoController.atualizar(lancamentoAtualizado, id);
    lancamento
        .then((resultLancamentoAtualizado) => 
            res.status(200).json(resultLancamentoAtualizado)
        )
        .catch((error) => res.status(400).json(error.message));
});


router.delete("/lancamentos/:id", (req, res) => {
    const { id } = req.params;
    const lancamento = lancamentoController.deletar(id);
    lancamento
    .then((resultLancamentoDeletado) =>
    res.status(200).json(resultLancamentoDeletado)
    )
    .catch((error) => res.status(400).json(error.message));
});

module.exports = router;