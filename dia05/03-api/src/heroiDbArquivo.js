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
        this.NOME_ARQUIVO = 'src/herois.json'
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

    async remover(idHeroi) {
        const dados = await this._obterArquivo();
        const dadosFiltrados = dados.filter(( { id } ) => id !== parseInt(idHeroi));

        return await this._escreverArquivo(dadosFiltrados);
    }

    async atualizar(idHeroi, heroiAtualizado) {
        const dados = await this._obterArquivo();

        // procuramos a posição que o heroi está
        const indiceHeroiAntigo = dados.findIndex(( { id } ) => id === parseInt(idHeroi));

        if(indiceHeroiAntigo === -1) {
            throw new Error('O herói não existe velho!');
        }

        const atual = dados[indiceHeroiAntigo];

        // removemos o item da lista
        // 2º parametroé quantos vai remover
        dados.splice(indiceHeroiAntigo, 1);

        // para remover todas as chaves que estejam vazias/undefined precisamos converter o objeto para string e depois para objeto de novo
        const objTexto = JSON.stringify(heroiAtualizado);
        const objFinal = JSON.parse(objTexto);

        const heroiAlterado = {
            ...atual,
            ...objFinal
        }

        const novaLista = [
            ...dados,
            heroiAlterado
        ];

        return await this._escreverArquivo(novaLista);
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