
const express = require('express');
const path = require('path');
const router = express.Router();
const jwt = require('jsonwebtoken');

// Função de middleware para verificar o token JWT
const verifyToken = (req, res, next) => {
    const token = req.cookies.jwt; // Obtenha o token dos cookies

    // Verifique se o token está presente
    if (!token) {
        // Se o token não estiver presente, redirecione para a página de login
        return res.redirect('/login');
    }

    // Verifique se o token é válido
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            // Se o token for inválido, redirecione para a página de login
            return res.redirect('/login');
        }
        // Se o token for válido, avance para a próxima função de middleware
        next();
    });
};

// Aplique o middleware de verificação de token JWT às rotas protegidas
router.get('/home', verifyToken, (req, res) => {
    res.render('home');
});

router.get('/evolucoes', verifyToken, (req, res) => {
    res.render('evolucoes');
});

const lancamentoController = require("../controllers/lancamentoController");


router.get('/', (req, res) => {
    res.render('cadastro');
});

router.get('/login', (req, res) => {
    res.render('login')
})


// Rota para logout
router.get('/logout', (req, res) => {
    // Limpar o cookie JWT
    res.clearCookie('jwt');

    // Redirecionar o usuário para a página de login
    res.redirect('/login');
});


/*router.get('/home', (req, res) => {
    res.render('home')
})*/


/*router.get('/evolucoes', (req, res) => {
    res.render('evolucoes')
})*/

/*-----------------------------------*/

router.get("/lancamentos/:id", verifyToken, (req, res) => {
    const { id } = req.params;
    const lancamento = lancamentoController.buscarPorId(id);
    lancamento
        .then((lancamento) => {
            if (!lancamento) {
                return res.status(404).json({ error: 'Lançamento não encontrado' });
            }
            res.status(200).json(lancamento);
        })
        .catch((error) => res.status(400).json({ error: error.message }));
});




router.get("/lancamentos", verifyToken, (req, res) => {
    const listaLancamentos = lancamentoController.buscar();
    listaLancamentos
        .then((lancamentos) => res.status(200).json(lancamentos))
        .catch((error) => res.status(400).json(error.message));
});


router.post("/lancamentos", verifyToken, (req, res) => {
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


router.put("/lancamentos/:id", verifyToken, (req, res) => {
    const { id } = req.params;
    const lancamentoAtualizado = req.body;
    const lancamento = lancamentoController.atualizar(lancamentoAtualizado, id);
    lancamento
        .then((resultLancamentoAtualizado) =>
            res.status(200).json(resultLancamentoAtualizado)
        )
        .catch((error) => res.status(400).json(error.message));
});


/*router.delete("/lancamentos/:id", (req, res) => {
    const { id } = req.params;
    const lancamento = lancamentoController.deletar(id);
    lancamento
    .then((resultLancamentoDeletado) =>
    res.status(200).json(resultLancamentoDeletado)
    )
    .catch((error) => res.status(400).json(error.message));
});*/


router.delete("/lancamentos/:id", verifyToken, (req, res) => {
    const { id } = req.params;
    lancamentoController.deletar(id)
        .then((resultLancamentoDeletado) => {
            res.status(200).json({ message: 'Lançamento excluído com sucesso' });
        })
        .catch((error) => res.status(400).json({ error: error.message }));
});



module.exports = router;