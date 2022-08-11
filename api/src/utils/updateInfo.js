const basePath = process.cwd();
const fs = require("fs");

async function UpdateMetadata(newCDI){
    let rawdata = fs.readFileSync(`${basePath}/build/json/_metadata.json`);
    let data = JSON.parse(rawdata);
  
    console.log('Updating Nfts images Metadata...');
  
    data.forEach((item, index) => {
      item.image = `ipfs.io/ipfs/${newCDI[index].path}`;
  
      let edition = item.name.replace('#','');
    
    fs.writeFileSync(
        `${basePath}/build/json/${edition}.json`,
        JSON.stringify(item, null, 2)
      );
    });
    
    fs.writeFileSync(
      `${basePath}/build/json/_metadata.json`,
      JSON.stringify(data, null, 2)
    );

    console.log(data);
    console.log(`Updated Metada for images.`);
    console.log(`Process Finished Succesfully!`);
}

module.exports = {
  UpdateMetadata
}


