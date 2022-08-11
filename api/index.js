const express = require('express');
var hivejs = require("@hiveio/hive-js");
const { createImages, buildSetup } = require("./src/functions.js");
const { SaveFile } = require('./src/utils/saveInIpfs.js');
const { mintNfts } = require('./src/utils/mintNfts.js');
const app = express();

app.use(
    express.urlencoded({
        extended: true,
    })
);

app.use(express.json({
    type: "*/*"
}));

app.get('/', (request, response) => {
    response.send("<h1>Hello Rama</h1>");
});

app.post('/', (request, response) => {
    const amount = request.body.amount;
    CreateNfts(amount);
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Api escuchando en el puerto ${PORT}`);
});

let CreateNfts = async (amount) => {
    console.log('Building Setup...');
    buildSetup();
    console.log('Finish Building Setup...');
    console.log('Creating Images...');
    await createImages(amount);
    console.log('Finish Creating Images...');
    console.log('Saving Files in Ipfs...');
    await SaveFile().then(async () => {
        console.log('Finish Saving Files in Ipfs...');
        console.log('Minting Nfts...');
        await mintNfts(hivejs, 'rama142694');
        console.log('Finish Minting Nfts...');
    });
}