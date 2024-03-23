class LancamentoController{

    buscar (){
        return "Buscando lancamentos....";
    }

    criar(){
        return "Criando lancamento....";
    }

    atualizar(id){
        return "Alterando lancamento numero "+ id + "...";
    }

    deletar(id){
        return "Deletando lancamneto numero " + id + "...";
    }

}

module.exports = new LancamentoController();