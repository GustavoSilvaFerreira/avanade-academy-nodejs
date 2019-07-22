/*
Nosso objetivo é seguir os seguintes passos
1. buscar cliente
2. buscar endereço
3. buscar telefone

// NomeCliente, Endereco, Telefone

Para rodar uma app: 
node nomeArquivo.js
OU
no VSCode -> F5

// p/ sincronizar app trabalhamos c/ uma convenção chamada CALLBACK (atendente c/ ticket do fastfood)
// callbacks tem como objetivo, passar uma função e executar após o agendamento
// callbacks -> geralmente recebem no minimo 2 params
1º erro -> qualquer problema
2º sucesso -> o resultado esperado
*/

function buscarClientes(id, callback) {
    // para simular uma função assincrona, usamos o serTimeOut

    setTimeout(() => {
        return callback(null, {
            id: id,
            nome: 'Xuxa da Silva',
            idade: 70
        })
    }, 2000);
}

function buscarEndereco(idCliente, callback) {
    // para simular uma função assincrona, usamos o serTimeOut

    setTimeout(() => {
        return callback(null, {
            id: 1,
            rua: 'dos bobos',
            numero: 0
        })
    }, 2000);
}

function buscarTelefone(idCliente, callback) {
    // para simular uma função assincrona, usamos o serTimeOut

    setTimeout(() => {
        return callback(null, {
            id: 0,
            ddd: 11,
            numero: '4002-8900'
        })
    }, 2000);
}

function main() {
    const cliente = buscarClientes('xuxa', function(erro, sucesso){
        // undefined, 0, '', {}, [], null
        if(erro) {
            console.log('Deu ruim', erro);
            return;
        }
        buscarEndereco(sucesso.id, function(erro1, sucesso1) {
            if(erro1) {
                console.log('Deu ruim', erro1);
                return;
            }
            buscarTelefone(sucesso.id, function(erro2, sucesso2) {
                if(erro2) {
                    console.log('Deu ruim', erro2);
                    return;
                }
                console.log(`Nome: ${sucesso.nome}, Endereço: ${sucesso1.rua}, ${sucesso1.numero}, Telefone: (${sucesso2.ddd}) ${sucesso2.numero}`);
            });
        });
    });
}

main();