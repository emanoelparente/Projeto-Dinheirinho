const lancamentoModel = require("../models/lancamentoModel");

class LancamentoController{

    buscar (){
        //return "Listando lancamentos....";
        return lancamentoModel.listar();
    }

    criar(novoLancamento){
        return lancamentoModel.criar(novoLancamento);
    }

    atualizar(lancamentoAtualizado, id){
        return lancamentoModel.atualizar(lancamentoAtualizado, id);
    }

    deletar(id){
        return lancamentoModel.deletar(id);
    }

}

module.exports = new LancamentoController();