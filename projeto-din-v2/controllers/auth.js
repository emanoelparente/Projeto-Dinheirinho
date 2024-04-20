const mysql = require("mysql");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

//conexão com banco de dados
const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});


exports.cadastro = (req, res) => {
    console.log(req.body);

    const { name, email, password, passwordConfirm } = req.body;
    db.query('SELECT email FROM users WHERE email = ?', [email], async (error, results) => {
        if (error) {
            console.log(error);
        }
        if (results.length > 0) {
            return res.render('cadastro', {
                messageExistsEmail: 'Este e-mail já está em uso'
            })
        } else if (password !== passwordConfirm) {
            return res.render('cadastro', {
                messagePasswordNotEquals: 'As senhas não correspondem'
            });
        }

        //encripta a senha
        let hashedPassword = await bcrypt.hash(password, 8);
        console.log(hashedPassword);

        //armazena os valores na base de dados com a senha já encriptada
        db.query('INSERT INTO users SET ?', { name: name, email: email, password: hashedPassword }, (error, results) => {
            if (error) {
                console.log(error);
            } else {
                console.log(results);
                return res.render('login', { /*'/login'*/
                    messageRegisterSuccessfull: 'Cadastro realizado'

                });
            }

        })

    });
}

//--------------------------------------------------------------------

/*exports.login = async (req, res) => {

    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).render('login', {
                messageEmptyField: 'Por favor, forneça e-mail e senha'
            });
        }

        db.query('SELECT * FROM users WHERE email = ?', [email], async (error, results) => {
            console.log(results);

            if (!results || results.length === 0 || !(await bcrypt.compare(password, results[0].password))) {
                res.status(401).render('login', {
                    messageErrorEmailPassword: 'Email ou senha está incorreto'
                });
            } else {
                const id = results[0].id;
                console.log(id);
                const token = jwt.sign({ id: id }, process.env.JWT_SECRET, {
                    expiresIn: process.env.JWT_EXPIRES_IN
                });

                console.log("The token is: " + token);

                const cookieOptions = {
                    expires: new Date(
                        Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
                    ),
                    httpOnly: true
                };
                res.cookie('jwt', token, cookieOptions);
                res.status(200).redirect("/home");

            }
        });

    } catch (error) {
        console.log(error);
    }
}*/


exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Verificar se o email e a senha foram fornecidos
        if (!email || !password) {
            return res.status(400).render('login', {
                messageEmptyField: 'Por favor, forneça e-mail e senha'
            });
        }

        // Consultar o banco de dados para encontrar o usuário com o email fornecido
        db.query('SELECT * FROM users WHERE email = ?', [email], async (error, results) => {
            if (error) {
                console.error(error);
                return res.status(500).send('Erro interno do servidor');
            }

            // Verificar se o usuário foi encontrado e se a senha está correta
            if (!results || results.length === 0 || !(await bcrypt.compare(password, results[0].password))) {
                return res.status(401).render('login', {
                    messageErrorEmailPassword: 'Email ou senha está incorreto'
                });
            }

            // Se o usuário foi encontrado e a senha está correta, extrair o ID do usuário
            const userId = results[0].id;
            console.log('id do usuario logado:' + userId);

            // Gerar um token JWT com o ID do usuário como reivindicação (claim)
            const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
                expiresIn: process.env.JWT_EXPIRES_IN
            });

            // Configurar opções do cookie
            const cookieOptions = {
                expires: new Date(
                    Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
                ),
                httpOnly: true
            };

            // Definir o token JWT no cookie
            res.cookie('jwt', token, cookieOptions);

            // Redirecionar o usuário para a página inicial após o login
            res.status(200).redirect("/home");
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send('Erro interno do servidor');
    }
}



