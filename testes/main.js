const axios = require('axios');
const rateLimit = require('axios-rate-limit');

const baseUrl = 'https://pokeapi.co/api/v2/';
// sets max 2 requests per 1 second, other will be delayed
// note maxRPS is a shorthand for perMilliseconds: 1000, and it takes precedence
// if specified both with maxRequests and perMilliseconds
async function teste () {
    const http = rateLimit(axios.create(), { maxRequests: 1, perMilliseconds: 5000})

    console.log(http.getMaxRPS());
    http.get(`${baseUrl}/pokemon/ditto`)
    .then((res1) => {
        console.log(res1.status);
    })
    .catch(() => {console.log('error 1');});

    http.get(`${baseUrl}/pokemon/ditto`)
    .then((res2) => {
        console.log(res2.status);
    })
    .catch(() => {console.log('error 2');});

    http.get(`${baseUrl}/pokemon/ditto`)
    .then((res3) => {
        console.log(res3.status);
    })
    .catch(() => {console.log('error 3');});
}

teste();
 
// // options hot-reloading also available
// http.setMaxRPS(3)
// http.getMaxRPS() // 3
// http.setRateLimitOptions({ maxRequests: 6, perMilliseconds: 150 }) // same options as constructor