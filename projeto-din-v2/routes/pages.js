
const express = require('express');
const path = require('path');
const router = express.Router();
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const db = require('../app');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');


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
        // Se o token for válido, extraia os dados do usuário, incluindo o ID
        req.user = decoded; // decoded contém os dados do usuário decodificados do token
        // Avance para a próxima função de middleware
        next();
    });
};



// Aplique o middleware de verificação de token JWT às rotas protegidas
router.get('/home', verifyToken, (req, res) => {
    res.render('home');
});


const transporter = nodemailer.createTransport({
    host: 'smtp-mail.outlook.com',
    port: 587,
    secure: false, // true para SSL
    auth: {
        user: 'emanuelparente@live.com',
        pass: 'fcsiaoquynxsscap'
    }
});

router.get('/recuperaSenha', (req, res) => {
    res.render('recuperaSenha');
});



router.post('/recuperaSenha', (req, res) => {
    const { email } = req.body;
    const token = crypto.randomBytes(20).toString('hex');
    const expiryDate = new Date();
    expiryDate.setHours(expiryDate.getHours() + 5); // Token válido por 5 horas

    db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
        if (err) {
            return res.status(500).send('Erro interno do servidor');
        }
        if (results.length === 0) {
            return res.status(404).send('E-mail não encontrado');
        }
        const user = results[0];
        user.resetToken = token;
        user.resetTokenExpiry = expiryDate;
        db.query('UPDATE users SET resetToken = ?, resetTokenExpiry = ? WHERE id = ?', [token, expiryDate, user.id], (err) => {
            if (err) {
                return res.status(500).send('Erro interno do servidor');
            }

            // Após armazenar o token no banco de dados, envie o e-mail
            const resetPasswordLink = `http://localhost:5000/redefinirSenha/${token}`;

            const mailOptions = {
                from: {
                    name: 'Dinheirinho',
                    address: 'emanuelparente@live.com'
                },
                to: user.email,
                subject: 'Redefinição de Senha',
                text: `Você solicitou a redefinição de senha. Clique no link para redefinir sua senha: ${resetPasswordLink}`,
                html: `
                    
                <div style="background-color: #689948; padding: 50px; margin: 0 200px; text-align: center; border-radius: 3px; font-family: 'Poppins', sans-serif;">
                    <img src="/images/logo-dinheirinho-letra-branca.png" alt="Ilustração" style="max-width: 100%; height: auto;">
                    <h1 style="color: #fff; font-size: 20px; line-height: 30px; padding-bottom: 30px; padding-top: 20px;">Você solicitou a redefinição de senha no Dinheirinho</h1>
                    <p style="color: #fff;font-size: 15px;">Por favor, clique no botão abaixo para redefinir sua senha</p>
                    <a href="${resetPasswordLink}" style="text-decoration: none;">
                        <button style="background-color: #fff; color: #77AF51; padding: 15px 30px; border: none; border-radius: 5px; cursor: pointer; font-family: 'Poppins', sans-serif; font-weight: 700; font-size: 17px;">REDEFINIR SENHA</button>
                    </a>
                    <br>
                    <p style="color: #fff; padding-top: 30px; line-height: 30px; font-size: 15px;">Se o botão acima não estiver funcionando, você pode clicar nesse link logo abaixo: </p>
                    <div style = "background-color: #fff">${resetPasswordLink}<div>
                </div>
            
                `
            };


            transporter.sendMail(mailOptions, (err, info) => {
                if (err) {
                    console.error('Erro ao enviar e-mail:', err);
                    return res.status(500).send('Erro ao enviar e-mail de recuperação de senha');
                } else {
                    console.log('E-mail enviado:', info.response);
                    return res.status(200).render('login', {
                        messageResetPassword: 'Verifique seu e-mail, um link de redefinição de senha foi enviado'
                    });
                }
            });
        });
    });
});

router.get('/redefinirSenha/:token', (req, res) => {
    res.render('redefinirSenha');
});

router.post('/redefinirSenha/:token', (req, res) => {
    const { token } = req.params;
    const { password, passwordConfirm } = req.body;

    // Verifica se a nova senha e a confirmação de senha correspondem
    if (password !== passwordConfirm) {
        return res.status(400).send('A nova senha e a confirmação de senha não correspondem');
    }

    // Encripta a nova senha antes de armazená-la no banco de dados
    bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
            return res.status(500).send('Erro ao encriptar a senha');
        }

        db.query('SELECT * FROM users WHERE resetToken = ? AND resetTokenExpiry > ?', [token, new Date()], (err, results) => {
            if (err) {
                return res.status(500).send('Erro interno do servidor');
            }
            if (results.length === 0) {
                return res.status(404).send('Token inválido ou expirado');
            }
            const user = results[0];
            // Atualiza a senha do usuário e limpa o token de redefinição de senha
            db.query('UPDATE users SET password = ?, resetToken = NULL, resetTokenExpiry = NULL WHERE id = ?', [hashedPassword, user.id], (err) => {
                if (err) {
                    return res.status(500).send('Erro interno do servidor');
                }
                return res.status(200).render('login', {
                    messageResetPassword: 'Senha redefinida com sucesso'
                });
            });
        });
    });
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



// PRIMEIRA

/*router.get("/lancamentos", verifyToken, (req, res) => {
    const userId = req.user.id; // Obtém o ID do usuário do token JWT
    
    lancamentoController.buscar(userId) // Chamando o método buscar do controlador
    .then((lancamentos) => {
        console.log(lancamentos);
        res.status(200).json(lancamentos);
    })
        .catch((error) => res.status(400).json({ error: error.message }));
        //console.log("Listado o usuário com id: " + userId);
        
});*/

router.get("/lancamentos", verifyToken, (req, res) => {
    const userId = req.user.id; // Obtém o ID do usuário do token JWT

    lancamentoController.buscar(userId) // Modificado para buscar apenas os lançamentos do usuário
        .then((lancamentos) => {
            const lancamentosDoUsuario = lancamentos.filter(lancamento => lancamento.user_id === userId);
            res.status(200).json(lancamentosDoUsuario);
        })
        .catch((error) => res.status(400).json({ error: error.message }));
});













router.post("/lancamentos", verifyToken, (req, res) => {
    const userId = req.user.id; // Obtém o ID do usuário do token JWT
    const novoLancamento = {
        Tipo_de_lançamento: req.body.tipo,
        Categoria: req.body.categoria,
        Forma: req.body.forma,
        Data_de_ocorrencia: req.body.data,
        Valor: req.body.valor,
        Descrição: req.body.descricao,
        user_id: userId
    };

    lancamentoController.criar(novoLancamento)
        .then(lancamentoCriado => res.status(201).json(lancamentoCriado))
        .catch((error) => res.status(400).json(error.message));
    console.log("Lançamento criado para o usuário com id: " + userId);
});


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


router.delete("/lancamentos/:id", verifyToken, (req, res) => {
    const { id } = req.params;
    lancamentoController.deletar(id)
        .then((resultLancamentoDeletado) => {
            res.status(200).json({ message: 'Lançamento excluído com sucesso' });
        })
        .catch((error) => res.status(400).json({ error: error.message }));
});


module.exports = router;