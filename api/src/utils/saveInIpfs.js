const {create} = require('ipfs-http-client');
const fs = require('fs');
const { UpdateMetadata } = require('./updateInfo.js');
const { NFTStorage, Blob } = require('nft.storage');
const { IpfsToken } = require('../config.js');

async function SaveFile() {
    return await new Promise(async (res,rej) => {
        console.log('Working in saving Files in ipfs...')

        const storage = new NFTStorage({ IpfsToken })
    
        fs.readdir('./build/images/', async (err,result) => {
            result = result.map(img => parseInt(img.replace('.png','')));
            const orderResult = result.sort((a,b)=>{
                return a-b;
             });
            
            let newCdis = [];
            for(var i=0; i < orderResult.length; i++){
                const cdi = await new Promise(async (resolve,reject) => {
                    fs.readFile(`./build/images/${orderResult[i]}.png`,async (err,res) => {
                        let uploaded = await storage.storeBlob(new Blob([res]));
                        console.log(`File ${i} saved.`);
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