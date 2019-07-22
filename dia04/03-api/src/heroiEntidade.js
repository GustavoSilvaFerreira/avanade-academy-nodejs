const { ObjectID } = require('mongodb')

class Heroi {
    // Extraimos somente o necessario para criar um heroi
    constructor({id, nome, idade, poder}) {
        // caso o id venha preenchido convertemos para o formato do Banco de dados, caso não venha mantemos undefined
        this._id = id ? ObjectID(id) : id
        this.nome = nome
        this.idade = idade
        this.poder = poder
    }
}

module.exports = Heroi