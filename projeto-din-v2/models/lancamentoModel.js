const path = require('path');
const conexao = require(path.join(__dirname, "../app"));


class LancamentoModel{
    listar(){
        const sql = "SELECT * FROM lançamento";
        return new Promise ((resolve, reject) => {
            conexao.query(sql, {}, (error, resposta) => {
                if(error){
                    console.log("Deu erro no listar...");
                    reject (error);
                }
                console.log("Showw");
                resolve(resposta);
            });
        });
    }

    criar(novoLancamento){
        const sql = "INSERT INTO lançamento SET ?";
        return new Promise((resolve, reject)=>{
            conexao.query(sql, novoLancamento, (error, resposta) => {
                if(error){
                    console.log("Deu erro no criar...");
                    reject(error);
                }
                console.log("Show..");
                resolve(resposta);
            });
        });
    }

    atualizar(lancamentoAtualizado, id){
        const sql = "UPDATE lançamento SET ? WHERE id = ?";
        return new Promise((resolve, reject)=>{
            conexao.query(sql, [lancamentoAtualizado, id], (error, resposta) => {
                if(error){
                    console.log("Deu erro no atualizar...");
                    reject(error);
                }
                console.log("Show..");
                resolve(resposta);
            });
        });
    }

    deletar(id){
        const sql = "DELETE FROM lançamento WHERE id = ?";
        return new Promise((resolve, reject)=>{
            conexao.query(sql, id, (error, resposta) => {
                if(error){
                    console.log("Deu erro no deletar...");
                    reject(error);
                }
                console.log("Show..");
                resolve(resposta);
            });
        });
    }
}

module.exports = new LancamentoModel();