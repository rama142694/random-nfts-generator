const express = require('express');
const { mintNfts, buildSetup } = require("./src/functions.js")
const app = express();

// app.use(
//     express.urlencoded({
//         extended: true,
//     })
// );

// app.use(express.json({
//     type: "*/*"
// }));

// app.get('/', (request, response) => {
//     response.send("<h1>Hello Rama</h1>");
// });

// app.post('/', (request, response) => {
// });

// const PORT = 3001;
// app.listen(PORT, () => {
//     console.log(`Api escuchando en el puerto ${PORT}`);
// });

buildSetup();
mintNfts();