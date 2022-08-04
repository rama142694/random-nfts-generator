const {create} = require('ipfs-http-client');
const fs = require('fs');
const { UpdateMetadata } = require('./updateInfo.js');
const { rejects } = require('assert');
const { resolve } = require('path');

async function ipfsClient() {
    const ipfs = await create({
        host: "ipfs.infura.io",
        port: 5001,
        protocol: "https",
    });
    return ipfs;
}

async function SaveFile() {
    let ipfs = await ipfsClient();

    fs.readdir('./build/images/', async (err,result) => {

        let newCdis = [];
        for(var i=0; i < result.length; i++){
            const cdi = await new Promise(async (resolve,reject) => {
                await fs.readFile(`./build/images/${result[i]}`,async (err,res) => {
                    let uploaded = await ipfs.add(res)
                    
                    resolve(uploaded);
                })
            })
            newCdis.push(cdi);
        }
        
        UpdateMetadata(newCdis)
    })
}

SaveFile();