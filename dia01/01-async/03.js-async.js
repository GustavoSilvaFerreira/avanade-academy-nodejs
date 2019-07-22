/*
a galera do c# implementou uma funcionalidade onde não precisamos mais usar .then e .catch
Nosso cósigo javascript fica exatamente igual a aplicações JAVA, PYTHON, C#
-> O mesmo código que é lido, a ordem será executada
*/
const { promisify } = require('util')

// convertemos a função obterTelefone
const obterTelefoneAsync = promisify(obterTelefone)


function buscarClientes(id) {
    // para simular uma função assincrona, usamos o serTimeOut
    // retornamos o objeto promise p/ resolver depois
    return new Promise(function(resolve, reject) {
        setTimeout(() => {
            return resolve({
                id: id,
                nome: 'Xuxa da Silva',
                idade: 70
            })
        }, 1000);
    });

}

function buscarEndereco(idCliente) {
    // para simular uma função assincrona, usamos o serTimeOut

    return new Promise(function(resolve, reject) {
        setTimeout(() => {
            return resolve({
                id: 1,
                rua: 'dos bobos',
                numero: 666
            })
        }, 1000);
    });

}

function obterTelefone(idCliente, callback) {
    // para simular uma função assincrona, usamos o serTimeOut

    setTimeout(() => {
        return callback(null, {
            id: 0,
            ddd: 11,
            numero: '4002-8900'
        })
    }, 1000);
}

// p/ usar o await precisa do async
// -> quando usamos o async, automaticamente a fnção passa a retornar um objeto Promise
async function main() {
    try {
        console.time('async-01')
        // p/ sinalizar o codigo javascript
        // p/ esperar a execução terminar
        // usamos a palavra chave await
        const cliente = await buscarClientes('xuxa')
        // Como o endereço e telefone não depende um do outro, podemos executa-los em segundo plano
        // temos uma função chamada .all que resolve um array de promises, quando terminado obtemos o resultado de todas de uma vez

        // const { rua, numero } = await buscarEndereco(cliente.id)
        // const telefone = await obterTelefoneAsync(cliente.id)

        const enderecoPromise = buscarEndereco(cliente.id)
        const telefonePromise = obterTelefoneAsync(cliente.id)

        // Retorna um array na ordem exata das funções
        const [telefone, {rua, numero}] = await Promise.all([
            telefonePromise,
            enderecoPromise
        ])
        /*
        respostas[0] -> dadosTelefone
        respostas[1] -> dadosEndereco
        */

        console.timeEnd('async-01')
    
        console.log(`${cliente.nome}, Endereço: ${rua} - ${numero}, Telefone: (${telefone.ddd}) ${telefone.numero}`);
    } catch(erro) {
        console.error('DEU RUIM', erro);
    }
}

main();