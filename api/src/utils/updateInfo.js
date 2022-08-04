const basePath = process.cwd();
const fs = require("fs");

// read json data
let rawdata = fs.readFileSync(`${basePath}/build/json/_metadata.json`);
let data = JSON.parse(rawdata);

function UpdateMetadata(newCDI){
  data.forEach((item, index) => {
    item.image = `ipfs.io/ipfs/${newCDI[index].path}`;
  
    fs.writeFileSync(
      `${basePath}/build/json/${item.edition}.json`,
      JSON.stringify(item, null, 2)
    );
  });
  
  fs.writeFileSync(
    `${basePath}/build/json/_metadata.json`,
    JSON.stringify(data, null, 2)
  );
  
  console.log(`Updated baseUri for images`);
}

module.exports = {
  UpdateMetadata
}


