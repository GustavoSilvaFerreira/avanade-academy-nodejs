// vamos instalar o modulo do mongodb
// npm install mongodb

// para listar bancos de dados alteramos o contexto para o banco selecionado
// se não existir, quando inserir um novo dado ele criará automaticamente
// use nomeDoBanco
// use admin -> banco default com varias colections
// use caracteres

// para inserir um novo item
// db.nomeDaColecao.insert({
//     nome: 'teste',
//     idade: 20
// })

// db.nomeDaColecao.find()
// db.nomeDaColecao.find({ nome: 'teste' })

// for(i = 0; i < 1000; i++) {
//     db.nomeDaColecao.insert({nome: 'teste' + i})
// }


const { MongoClient } = require('mongodb');

class HeroiDb {
    constructor() {
        this.heroiCollection = {};
    }

    async connect() {
        // p/ conectar com o mongodb local
        // localhost:27017/dbName
        const mongodbString = process.env.MONGO_URI;
        const mongoClient = new MongoClient(mongodbString, { useNewUrlParser: true });
        const connection = await mongoClient.connect();
        const heroiCollection = await connection.db(process.env.MONGO_DATABASE).collection(process.env.MONGO_COLLECTION);

        // adicionamos o heroi para a instancia da classe
        this.heroiCollection = heroiCollection;
    }

    async cadastrar(heroi) {
        return this.heroiCollection.insertOne(heroi);
    }

    async listar(heroi, skip = 0, limit = 10) {
        let filtro = {};
        if(heroi.nome) {
            // usamos um operador do MongoDb para filtrar frases que contenham aquele texto
            filtro = { nome: 
                        { 
                            $regex: `.*${heroi.nome}*.`, 
                            $options: 'i' 
                        } 
                    }
        }
        return this.heroiCollection
                    .find(filtro)
                    .skip(parseInt(skip))
                    .limit(parseInt(limit))
                    .toArray()
    }

    async remover(id) {
        return this.heroiCollection.deleteOne({ _id: id });
    }

    async atualizar(idHeroi, heroiAtualizado) {
        // 1º parametro é o filtro
        // 2º o que substituirá o arquivo
        // se esquecer de mandar o operador VAI PERDER O DADO
        // $set: dao -> ESQUECEU O SET -> VAI PERDER
        return this.heroiCollection.updateOne({
            _id: idHeroi
        }, {
            $set: heroiAtualizado
        });
    }


}
// exportamos o modulo
module.exports = HeroiDb;

// async function main() {
//     const heroi = new HeroiDb();
//     const { heroiCollection } = await heroi.connect();
//     await heroiCollection.insertOne({
//         nome: 'Flash',
//         poder: 'Velocidade',
//         idade: 20
//     });
//     const items = await heroiCollection.find().toArray();
//     console.log('items', items);
// }

// main();