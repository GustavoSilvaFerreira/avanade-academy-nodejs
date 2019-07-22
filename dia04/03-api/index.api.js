// vamos importar a biblioteca padrão do Node.js para trabalhar com requisições Web
const http = require('http');

// http://localhost:3000/
// http.createServer((req, res) => {
//     res.end('Hello world!');
// })
// .listen(3000, () => console.log('server rodando'))

/*
Vamos trabalhar com o Padrão Rest
Rest x Restfull
-> JSON (Javascript Schema Object Notation)
-> Rest -> Padrão  (convenção) de APIs (Não é frameworks)

AÇÃO    |   METODO   |   URL
Cadstrar    |   Post    |   /v1/herois -> dados no body
Atualizar   |           |   /v1/herois/:id -> dados no body
                Patch -> usado para atualização parcial
                Put   -> usado para substituir toda informação original
Remover     |   Delete  |   /v1/herois/:id
Listar      |   Get     |   /v1/herois?skip=0&limit=10&nome=e
Listar      |   Get     |   /v1/herois/:id/habilidades
Listar      |   Get     |   /v1/herois/:id/habilidades/:id

npm install hapi

Para não precisar ficar reiniciando o node, vamos instalar uma lib
-D ou --save-dev salva a dependência somente para desenvolvimento
npm install -D nodemon

vamos add scripts automaticamente em nosso package.json
npx -> ele executa comandos usando a node_modules
start: npx nodemon index.api.js

para executar
npm start
caso o comando for qualquer outro nome
"desenvolvimento": "ola mundo" => npm run desenvolvimento
usamos o RUN para comandos customizados

Para padronizar status de operação das APIs usamos o Boom
npm install boom
*/

// para evitar varios IFs, podemos trabalhar com schemas de validação onde validamos o pedido primeiro antes de passar pelo nosso HANDLER
// npm install joi

// para documentar a aplicação automaticamente, vamos usar a lib swagger
// para usa-la precisamos seguir alguns passos
// 1º add o plugin ao Hapi
// 2º add tags (api) nas configs de rotas

// npm install hapi-swagger@9.1.3 inert vision 

const Hapi = require('hapi')

// importamos o joi para validar as requisições
// toda vez que for usar adicionar na config.validate da rota
const Joi = require('joi')

// Swagger são os 3 abaixo
const HapiSwagger = require('hapi-swagger')
const Vision = require('vision')
const Inert = require('inert')

// boom para status HTTP
const Boom = require('boom')

const { ObjectID } = require('mongoDb')

const Db = require('./src/heroiDb')

const app = new Hapi.Server({
    port: 3000
})

async function main() {
    try {
        const database = new Db()
        await database.connect()
        console.log('Database conectado!');

        await app.register([
            Inert,
            Vision,
            {
                plugin: HapiSwagger,
                options: {
                    documentationPath: '/v1/documentation',
                    info: {
                        title: 'API Heroes - Gustavo',
                        version: 'v1.0'
                    },
                    lang: 'pt'
                }
            }
        ])

        // vamos definir as rotas
        app.route([
            {
                // http://localhost:3000/v1/herois?nome=flash
                // http://localhost:3000/v1/herois?skip=1&limit=2
                path: '/v1/herois',
                method: 'GET',
                config: {
                    tags: ['api'],
                    description: 'Listar Herois',
                    notes: 'Pode filtrar por nome e pagina',
                    validate: {
                        // por padrão o Hapi nçao mostra os erros então manipulamos a função para mostrar
                        failAction: (request, h, err) => {
                            throw err
                        },
                        // podemos validar headers, query, payload e params
                        query: {
                            nome: Joi.string().max(10).min(2),
                            skip: Joi.number().default(0),
                            limit: Joi.number().max(10).default(10)
                        }
                    }
                },
                handler: async (request) => {
                    try {
                        const { query } = request
                        const { skip, limit } = query
                        
                        // por padrão tudo que vem da web cem como string temos que fazer o mapeamento manual o mongoDb 4
                        // não deixa usar mais string para esse caso
                        return database.listar(query, skip, limit)
                    } catch (error) {
                        console.error('DEU RUIM herois v1 get', error)
                        return Boom.internal();
                    }
                }
            },
            {
                path: '/v1/herois',
                method: 'POST',
                config: {
                    tags: ['api'],
                    description: 'Cadastrar Herois',
                    notes: 'Cadastra por nome, idade e poder',
                    validate: {
                        failAction: (r, h, erro) => {
                            throw erro
                        },
                        payload: {
                            nome: Joi.string().max(10).required(),
                            idade: Joi.number().min(18).required(),
                            poder: Joi.string().max(10).required()
                        }
                    }
                },
                handler: async (request, h) => {
                    try {
                        const { payload } = request
                        const v = await database.cadastrar(payload)
                        // código correto para cadastrado (created)
                        return h.response(v).code(201)
                    } catch (error) {
                        console.error('DEU RUIM herois v1 post', error)
                        return Boom.internal();
                    }
                }
            },
            {
                path: '/v1/herois/{id}',
                method: 'DELETE',
                config: {
                    tags: ['api'],
                    description: 'Remove Herois',
                    notes: 'Remove herois por ID',
                    validate: {
                        failAction: (r, h, erro) => {
                            throw erro
                        },
                        params: {
                            id: Joi.string().max(40).required()
                        }
                    }
                },
                async handler(request) {
                    try {
                        const { id } = request.params
                        return database.remover(ObjectID(id))
                    } catch (error) {
                        console.error('DEU RUIM herois v1 delete', error)
                        return Boom.internal();
                    }
                }
            },
            {
                path: '/v1/herois/{id}',
                method: 'PATCH',
                config: {
                    tags: ['api'],
                    description: 'Atualiza herois',
                    notes: 'Atualiza herois parcialmente',
                    validate: {
                        failAction: (r, h, erro) => {
                            throw erro
                        },
                        params: {
                            id: Joi.string().max(40).required()
                        },
                        payload: {
                            nome: Joi.string().max(10).min(2),
                            poder: Joi.string().max(10).min(2),
                            idade: Joi.number().min(18)
                        }
                    }
                },
                async handler(request) {
                    try {
                        // const { id } = request.params
                        // const { payload } = request
                        const {
                            params: {
                                id,
                            },
                            payload
                        } = request

                        return database.atualizar(ObjectID(id), payload)
                    } catch (error) {
                        console.error('DEU RUIM herois v1 delete', error)
                        return Boom.internal();
                    }
                }
            }

        ])

        await app.start()
        console.log(`Servidor rodando ${app.info.host}:${app.info.port}`);
        
    } catch (error) {
        console.error('DEU RUIM', error)
    }
}
main();