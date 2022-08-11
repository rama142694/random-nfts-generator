const {create} = require('ipfs-http-client');
const fs = require('fs');
const { UpdateMetadata } = require('./updateInfo.js');
const { NFTStorage, Blob } = require('nft.storage');

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDFFNEZlNUZhRDk0YTVjODNEM2MyODJjNGIyNDI1NmFkMDE3OUMyMzQiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY2MDIyNzM0MjM2NCwibmFtZSI6Imhhc2hraW5nc1Rlc3QifQ.DFqJor80e3kyxGVXBdNV_2WUOFkNYxescgruahf8ITY';

async function SaveFile() {
    return await new Promise(async (res,rej) => {
        console.log('Working in saving Files in ipfs...')

        const storage = new NFTStorage({ token })
    
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