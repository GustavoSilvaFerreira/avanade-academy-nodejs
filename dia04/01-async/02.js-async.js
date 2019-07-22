/*
Callback funciona,mas é mais complicado de amnipular conforme aplicação crescer.

Par manipular funções de força assincrona temos a classe Promise

-> Trabalhos com estados
    -> Toda alteração retorna uma função

-> Quando criamos uma Promise
    -> Pending
-> Quando temos um erro
    -> Rejected
-> Quando temos um seucesso
    -> Success / Fullfield

-> Uma promise sempre retorna outra Promise

promise = new Promise(function (resolve, reject) {
    return reject(valor) => erro
    return resolve(valor) => sucesso
});

p/ capturar resultados Promise
    -> resultado -> .then
    -> error -> .catch
    -> finally -> .finally

// importamos um módulo interno do nofo.js para converter callbacks para Promises,
// IMPORTANTE: Caso a função que tenha callback não seguir a convenção (erro, sucesso), não vai 
// conseguir realizar a conversão
// util.promisify
// util.log
// util.isString

// p/ extrair somente o necessário de um obj -> {nomeDaChave} = objeto
// técnica chama DESTRUCTURING
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
                numero: 0
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

function main() {
    const clientesPromise = buscarClientes('xuxa');
    // p/ pegar o sucesso
    clientesPromise
    .then(function(cliente) {
        const clienteId = cliente.id;
        return buscarEndereco(clienteId)
        .then(function(endereco) {
            return {
                id: cliente.id,
                nome: cliente.nome,
                endereco: `${endereco.rua}, ${endereco.numero}`
            }
        });
    })
    .then(function(clienteEndereco) {
        const { id } = clienteEndereco;
        return obterTelefoneAsync(id)
        .then(function(telefone) {
            // p/ clonar um objeto reutilizar todas as chaves adicionando o necessario
            return {
                ...clienteEndereco,
                telefone: `(${telefone.ddd}) ${telefone.numero}`
            }
        })
    })
    .then(function(resultado) {
        console.log(resultado);
    })
    .catch(function(error) {
        console.error('DEU RUIM', error);
    });
}

main();