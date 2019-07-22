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
    const dbArquivo = new HeroiDbArquivo()

    const heroi = new Heroi(commander)

    // node index.js --cadastrar
    // node index.js --c
    /*
        node index.js --id 1 --nome Flash --poder Velocidade --idade 80 --cadastrar
        node index.js --id 1 --nome Batman --poder Dinheiro --idade 80 --cadastrar
        node index.js --id 1 --nome "Lanterna Verde" --poder Anel --idade 50 --cadastrar
    */
    if(commander.cadastrar) {
        await dbArquivo.cadastrar(heroi);
        console.log('Herói cadastrado com sucesso!');
        return;
    }

    /*
        node index.js --id 1562884348425 --nome Flash --poder "Força" --idade 30 --atualizar
    */
    if(commander.atualizar) {
        const { id } = heroi;
        if(!id) {
            throw new Error('Você deve passar o ID');
        }

        delete heroi.id;
        await dbArquivo.atualizar(id, heroi);

        console.log('Herói atualizado com sucesso!');
        return;
    }

    /*
        node index.js --id 1 --remover
    */
    if(commander.remover) {
        const id = heroi.id;
        if(!id) {
            throw new Error('Você deve passar o ID');
        }

        await dbArquivo.remover(heroi.id);
        console.log('Heroi removido com sucesso!')
        return;
    }

    /*
        node index.js --nome fl --listar
    */
    if(commander.listar) {
        // no js atualmente usamos 2 tipos de variáveis
        // const = valores que nunca se alteram
        // let = valores que podem ser alterados

        let filtro = {};
        if(heroi.nome) {
            filtro = { nome: heroi.nome };
        }

        const herois = await dbArquivo.listar(filtro);
        console.log('herois', JSON.stringify(herois));
        return;
    }
}

main()