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

function main() {
    const heroi = new Heroi(commander)

    // node index.js --cadastrar
    // node index.js --c
    /*
        node index.js --id 1 --nome Flash --poder Velocidade --idade 80 --cadastrar
    */
    if(commander.cadastrar) {
        console.log('chamou cadastrar', heroi)
        return;
    }

    if(commander.atualizar) {
        console.log('chamou atualizar', heroi)
        return;
    }

    if(commander.remover) {
        console.log('chamou remover', heroi)
        return;
    }

    if(commander.listar) {
        console.log('chamou listar', heroi)
        return;
    }
}

main()