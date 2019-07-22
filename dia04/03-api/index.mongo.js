// para instala pacotes externos usamos a ferramenta npm (node package manager) ou YARN (foi criado pelo FB para ser mais performatico)

// Para iniciar um projeto node.js precisamos de um arquivo que define os pacotes. Quando outra pessoa precisar acessar o seu cósigo, 
//este arquivo lhe ensina como instalar ou quias versões são suportadas.

// para iniciar um projeto
// npm init
// -> -y => não precisa de wizard

// para trabalhar com programas de linha de comando usaremos o Comander
// npm install commander
// --save (Nao PASSO)
// --save-dev -> Ferramentas como transpiladores, testes, ferramentas para diminuir o tamanho do arquivo

// importamos o Heroi
const Heroi = require('./src/heroiEntidade')

// instalar o Path Intelisense no code
const HeroiDbArquivo = require('./src/heroiDbArquivo')

// import mongo db
const HeroiMongoDb = require('./src/heroiDb')

// importamos o commander
const Commander = require('commander')
const commander = Commander
                    .version('v1.0')
                    .option('-n, --nome [value]', 'O nome do Heroi')
                    .option('-i, --idade [value]', 'A idade do Heroi')
                    .option('-I, --id [value]', 'O id do Heroi')
                    .option('-p, --poder [value]', 'O poder do Heroi')
                    // definimos opções para utilizar de acordo com a chamada do cliente
                    .option('-c, --cadastrar', 'deve cadastrar um Heroi')
                    .option('-a, --atualizar [value]', 'deve atualizar um Heroi')
                    .option('-r, --remover', 'deve remover um Heroi')
                    .option('-l, --listar', 'deve listar um Heroi')
                    .parse(process.argv)

async function main() {
    try {
        // const dbArquivo = new HeroiDbArquivo()

        const dbMongo = new HeroiMongoDb()
        await dbMongo.connect();
        console.log('Mongo conectado!');
        

        const heroi = new Heroi(commander)

        // node index.js --cadastrar
        // node index.js --c
        /*
            node index.mongo.js --id 1 --nome Flash --poder Velocidade --idade 80 --cadastrar
            node index.mongo.js --id 1 --nome Batman --poder Dinheiro --idade 80 --cadastrar
            node index.mongo.js --id 1 --nome "Lanterna Verde" --poder Anel --idade 50 --cadastrar
        */
        if(commander.cadastrar) {
            await dbMongo.cadastrar(heroi);
            console.log('Herói cadastrado com sucesso!');
            // falamos para o node que terminamos a tarefa
            process.exit(0);
            return;
        }

        /*
            node index.js --id 1562884348425 --nome Flash --poder "Força" --idade 30 --atualizar
            node index.mongo.js --id 5d27d2602542cd4e6cd3295a --poder "Ricão" --atualizar
        */
        if(commander.atualizar) {
            const { _id } = heroi;

            if(!_id) {
                throw new Error('Você deve passar o ID');
            }

            // p/ não atualizar com o _id
            delete heroi._id;

            // gambeta do bem, para remover as chaves indefined
            const heroiFinal = JSON.parse(JSON.stringify(heroi));
            
            await dbMongo.atualizar(_id, heroiFinal);

            console.log('Herói atualizado com sucesso!');
            process.exit(0);
            return;
        }

        /*
            node index.mongo.js --id 5d27d011e562513178cc2484 --remover
        */
        if(commander.remover) {
            const id = heroi._id;
            if(!id) {
                throw new Error('Você deve passar o ID');
            }

            await dbMongo.remover(id);
            console.log('Heroi removido com sucesso!')
            process.exit(0);
            return;
        }

        /*
            node index.mongo.js --nome fl --listar
        */
        if(commander.listar) {
            // no js atualmente usamos 2 tipos de variáveis
            // const = valores que nunca se alteram
            // let = valores que podem ser alterados
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

            const herois = await dbMongo.listar(filtro);
            console.log('herois', JSON.stringify(herois));
            process.exit(0);
            return;
        }
    } catch (error) {
        console.error('DEU RUIM', error)
        process.exit(0)
    }
}

main()