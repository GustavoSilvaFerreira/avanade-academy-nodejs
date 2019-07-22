// importamos o módulo para trabalhar com arquivo
const { 
    exists,
    promises: {
        writeFile,
        readFile,
    },
} = require('fs')

// o exists não existe na promises API, precisamos converter manualmente
// -> O exists não segue o padrão CALLBACK, então não conseguimos usar o promisify nele
// 1º importar o exists padrão
// 2º converter para promise
const existsAsync = (parametro) => new Promise((resolve, reject) => {
    return exists(parametro, (existe) => resolve(existe))
})

class HeroiDbArquivo {
    constructor() {
        this.NOME_ARQUIVO = 'herois.json'
    }

    async _obterArquivo() {
        // verificamos se o arquivo existe antes de acessar seu conteúdo
        if(! await existsAsync(this.NOME_ARQUIVO)) {
            return [];
        }
        // lemos o arquivo no diretorio e convertemos para json
        const texto = await readFile(this.NOME_ARQUIVO)
        return JSON.parse(texto)
    }

    async _escreverArquivo(dado) {
        // pegamos o dado no formato objeto javascript e convertemos para texto com a função abaixo
        const dadoTexto = JSON.stringify(dado)
        await writeFile(this.NOME_ARQUIVO, dadoTexto)
        return;
    }

    async cadastrar(heroi) {
        // obtemos os heróis
        const herois = await this.listar();

        // criar um id baseado na hora (NÃO FAZER ISSO)
        heroi.id = Date.now();
        herois.push(heroi);

        await this._escreverArquivo(herois)
        return;
    }

    // vamos definir que o filtro é opcional
    async listar(filtro = {}) {
        // caso o cliente não filtrar dados retornamos todos os itens
        if(!Object.keys(filtro).length) {
            return await this._obterArquivo();
        }

        const dados = await this._obterArquivo();
        // para entrar em cada item da lista, para cada item chamaremos uma função
        // caso a asserção for verdadeira ele continua no array

        const dadosFiltrados = dados.filter(heroi => ~heroi.nome.toLowerCase().indexOf(filtro.nome.toLowerCase()));
        return dadosFiltrados;
    }
}
// exportamos a nossa classe
module.exports = HeroiDbArquivo;

// testamos a classe
// lembrar de comentar depois

// async function main() {
//     const minhaClasse = new HeroiDbArquivo()
//     // await minhaClasse.cadastrar({
//     //     nome: "Flash",
//     //     poder: "Velocidade"
//     // })

//     // const dado = await minhaClasse._obterArquivo()

//     const dado = await minhaClasse.listar({
//         nome: 'fl'
//     })

//     console.log('dado', dado);
    
// }

// main();