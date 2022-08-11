const {create} = require('ipfs-http-client');
const fs = require('fs');
const { UpdateMetadata } = require('./updateInfo.js');

async function ipfsClient() {
    const ipfs = await create({
        host: "ipfs.infura.io",
        port: 5001,
        protocol: "https",
    });
    return ipfs;
}

async function SaveFile() {
    return await new Promise(async (res,rej) => {
        console.log('Working in saving Files in ipfs...')
    
        let ipfs = await ipfsClient();
    
        fs.readdir('./build/images/', async (err,result) => {
                let newCdis = [];
                for(var i=0; i < result.length; i++){
                    const cdi = await new Promise(async (resolve,reject) => {
                        fs.readFile(`./build/images/${result[i]}`,async (err,res) => {
                            let uploaded = await ipfs.add(res);
                            resolve(uploaded);
                        })
                    })
                    newCdis.push(cdi);
                }
    
                console.log(newCdis);
                console.log('Files saved in IPFS.')
                await UpdateMetadata(newCdis);
                console.log('Termine');
                res();
        })
    })
}

module.exports = {
    SaveFile
}