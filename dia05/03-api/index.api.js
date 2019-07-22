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

// AUTENTICAÇÃO
// Um pacote conhecido na web para autenticar APIs Restfull. é conhecido como JWT -> JSON Web Token

//-> Autenticação
//  -> Login
// -> Autorização
//  -> Permissão de acesso
// Vamos usar o melhor computador do mundo. o do Cliente, uma vez logado, fornecemos um TOKEN que o usuário usa a cada chamada.
// Não usamos SESSÃO ou COOKIE, pois honera o servidor, é difícil de escalar e gasta mais memória.
// Precisamos de duas rotas
// Publica -> Login
// Privadas -> Todas as nossas APIs
/*
Vamos instalar um pacote para manipular token
-> Sign, Verify. jwt.io
npm install jsonwebtoken

Para validar todos os requests baseado numa estrategia padrão de autenticação, precisamos instalar o hapi jwt.
requests validam token primeiro e só depois chamam o handler

npm i hapi-auth-jwt2
-> 1º Registrar o plugin
-> 2º Criar a estratégia JWT (que vai refletir em todas as rotas)
-> 3º passo, colocar auth: false nas rotas publicas

PARA GERENCIAR AMBIENTES
-> Produção
-> Desenvolvimento
-> Homologação

vamos dividir nossos ambientes
config
    -> .env.development
    -> .env.production

npm i dotenv
IMPORTANTE: Só chamamos a configuração no arquivo inicial

// para usar variaveis de ambiente multi plataforma instalamos o cross-env
npm i cross-env

Criamos o banco de dados na mongoDb.com
-> Criamos o usuario > Security > Database Access > Add user
-> liberamos o IP > Security Network Access > Add IP Address
-> Allow Any IP

Pegamos a conexão -> Clusters -> Connect -> Connect
application e copiamos a string <user>:<senha>...
coltamos a maquina local e testamos a conexão mongo stringMongoDB
show dbs

copiamos e colamos .env.dev.. e criamos o .prod
-> substituimos a KEY do JWT por uma escolha por nos
-> Add a nova string do Mongo
    -> removemos tudo que tinha de /test para frente
    -> substituimos o /teste pela nossa db /caracteres

-> add no pachage.json o script para prod
-> para rodar:
npm run prod

npm i -g heroku
heroku login

heroku apps -> para listar as aplicações

para subir a aplicação e gerar a URL automática no heroku
1º git init
2.1 criar o arquivo Procfile
    -> Arquivo do heroku ensinando como rodar nossa APP

2º npx gitignore node -> vai criar um arquivo para ignorar arquivos comunsdo node (build, node_modules, bin)
TODA ALTERAÇÃO, que for para produção, rodar os passos abaixo (3,4,5)
3º git add .
4º git commit -m "Versão 1"

5º heroku apps:create meuNome-herois
-> apos esse processo, o heroku vai add a originem nosso repositorio local

6º git push heroku master

heroku logs -a nomeDoApp -t
-> T -> Tail, qualquer alteração reflete no terminal

O node se der problema ele QUEBRA e não volta
Não sabemos quanto de cpu/memória/disco a aplicação está usando e dica dificil saber se precisa escalar

npm i pm2
pm2 keymetrics

pm2 list -> lista as aplicações
pm2 start nomeArquivo.js -i 10
pm2 stop 0
pm2 monit
pm2 logs 1

// CONFIG HEROKU
ENV PM2_PUBLIC_KEY edkzc6hr3n2hwyw
ENV PM2_SECRET_KEY sybdegvgra93aqz
heroku config:set PM2_PUBLIC_KEY=edkzc6hr3n2hwyw PM2_SECRET_KEY=sybdegvgra93aqz

// TESTE DE CARGA
npm i -g autocannon

autocannon 'https://gustavoapi-herois.herokuapp.com/v1/herois?skip=0&limit=10' --header 'Accept: application/json' --header 'authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c3VhcmlvIjoiY2hhcG9saW4iLCJpYXQiOjE1NjMwNDEyODYsImV4cCI6MTU2MzA0MTM0Nn0.krx3dahEC5k224uW-Am1yQ0jsDg2pGLtcn1HOLVgh4I' --header 'Content-Type: application/json' --duration 10 --concurrent 300

Por padrão aplicações vem fechadas, e voce define quem pode acessar a sua API

Se alguem tentar acessar, vai cair no erro Cross Origin Resource Source (CORS), 
    routes: {
    cors: {
        origin: ['*'], // an array of origins or 'ignore'
        headers: ['Authorization'], // an array of strings - 'Access-Control-Allow-Headers' 
        exposedHeaders: ['Accept'], // an array of exposed headers - 'Access-Control-Expose-Headers',
        additionalExposedHeaders: ['Accept'], // an array of additional exposed headers
        maxAge: 60,
        credentials: true // boolean - 'Access-Control-Allow-Credentials'
    }
}
*/
// FAZEMOS A CONFIG DE AMBIENTE ANTES DE TODOS OS PACOTES
//Pois se algum deles precisar usar alguma dessas variaveis não será afetado
const { config } = require('dotenv')

const env = process.env.NODE_ENV
config({
    path: `./config/.env.${env}`
})

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

// jwt para manipular token
const Jwt = require('jsonwebtoken')

// hapi jwt para validar em todos os request
const HapiJwt = require('hapi-auth-jwt2')

const { ObjectID } = require('mongodb')

const Db = require('./src/heroiDb')

const app = new Hapi.Server({
    port: process.env.PORT,
    // devemos informar quem pode acessar a nossa API
    routes: {
        // outra opção
        // cors: true,
        cors: {
            // podemos informar a lista de clientes que podem acessar
            // para liberar a todos, deixamos o *
            origin: ['*'],
        }
    }
})

const MINHA_CHAVE_SECRETA = process.env.JWT_KEY;
const USER = {
    usuario: process.env.USER_API,
    senha: process.env.SENHA_API,
}

// colocar em todas as rotas dentro do objeto VALIDATE
const defaultHeader = Joi.object({
    authorization: Joi.string().required()
}).unknown()

async function main() {
    try {
        const database = new Db()
        await database.connect()
        console.log('Database conectado!');

        await app.register([
            HapiJwt,
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
                    lang: process.env.API_LANG,
                }
            }
        ])

        // criamos uma estrategia de autenticação padrão para refletir em todas as rotas
        app.auth.strategy('jwt','jwt', {
            key: MINHA_CHAVE_SECRETA,
            validate: (dado, request) => {
                // poderiamos validar o usuario no banco
                // verificar se ele está com a conta em dia
                // ou mesmo se continua ativo na base

                return {
                    isValid: true
                }
            }
        })
        app.auth.default('jwt')

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
                        },
                        headers: defaultHeader
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
                        },
                        headers: defaultHeader
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
                        },
                        headers: defaultHeader
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
                        },
                        headers: defaultHeader
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
            },
            {
                path: '/v1/login',
                method: 'POST',
                config: {
                    // desabilitamos a autenticação no login
                    auth: false,
                    tags: ['api'],
                    description: 'Fazer login',
                    notes: 'Login with user e password',
                    validate: {
                        failAction: (r, h, erro) => {
                            throw erro
                        },
                        payload: {
                            usuario: Joi.string().max(10).required(),
                            senha: Joi.string().min(3).max(100).required()
                        }
                    }
                },
                async handler({payload: { usuario, senha }}) {
                    try {
                        if(usuario !== USER.usuario || senha !== USER.senha) {
                            return Boom.unauthorized()
                        }

                        const tokenPayoad = {usuario}

                        const token = Jwt.sign(tokenPayoad, MINHA_CHAVE_SECRETA, { 
                            expiresIn: '60s', 
                        });

                        return {token}
                    } catch (error) {
                        console.error('DEU RUIM Login', error)
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