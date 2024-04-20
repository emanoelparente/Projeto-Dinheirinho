const path = require('path');
const conexao = require(path.join(__dirname, "../app"));


class LancamentoModel {


    listar() {
        const sql = "SELECT * FROM lançamento";
        return new Promise((resolve, reject) => {
            conexao.query(sql, {}, (error, resposta) => {
                if (error) {
                    console.log("Deu erro no listar...");
                    reject(error);
                }
                console.log("Registrado com sucesso");
                resolve(resposta);
            });
        });
    }


buscarPorId(id) {
    const sql = "SELECT * FROM lançamento WHERE id = ?";
    return new Promise((resolve, reject) => {
        conexao.query(sql, id, (error, resposta) => {
            if (error) {
                console.error("Erro ao buscar lançamento por ID:", error);
                reject(error);
            } else if (resposta.length === 0) {
                console.error("Nenhum lançamento encontrado com o ID fornecido:", id);
                resolve(null);
            } else {
                console.log("Lançamento encontrado:", resposta[0]);
                resolve(resposta[0]);
            }
        });
    });
}


criar(novoLancamento) {
    const sql = "INSERT INTO lançamento SET ?";
    return new Promise((resolve, reject) => {
        conexao.query(sql, novoLancamento, (error, resposta) => {
            if (error) {
                console.error("Erro ao criar lançamento:", error);
                reject(error);
            }
            console.log("Lançamento criado com sucesso.");
            resolve(resposta);
        });
    });
}



atualizar(lancamentoAtualizado, id) {
    const sql = "UPDATE lançamento SET ? WHERE id = ?";
    return new Promise((resolve, reject) => {
        conexao.query(sql, [lancamentoAtualizado, id], (error, resposta) => {
            if (error) {
                console.log("Deu erro no atualizar...");
                reject(error);
            }
            console.log("Atualizado com sucesso..");
            resolve(resposta);
        });
    });
}

deletar(id) {
    const sql = "DELETE FROM lançamento WHERE id = ?";
    return new Promise((resolve, reject) => {
        conexao.query(sql, id, (error, resposta) => {
            if (error) {
                console.log("Deu erro no deletar...");
                reject(error);
            }
            console.log("Deletado com sucesso..");
            resolve(resposta);
        });
    });
}
}

module.exports = new LancamentoModel();