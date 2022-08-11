const basePath = process.cwd();
const fs = require("fs");
var hivejs = require("@hiveio/hive-js");

//CONFIG
const account = "The account you will send the nfts";
const CONTRACT_CREATOR = "rama142694";
const UTILITY_TOKEN_SYMBOL = "RAMANFTS";
const ACTIVEKEY = '5KQfGLxvZCiw6RUh83bUbbakzSP11637nz71kYx7UKYkimzamaQ';

async function mintNfts(hive, user) {
  let rawdata = fs.readFileSync(`${basePath}/build/json/_metadata.json`);
  let data = JSON.parse(rawdata);

  let instances = [];

  data.forEach(nft => {
      
    const properties = nft;

    const instance = {
      symbol: UTILITY_TOKEN_SYMBOL,
      to: user,
      feeSymbol: "PAL",
      properties,
    };

    instances.push(instance);
  });
  
  let json = {
    contractName: "nft",
    contractAction: "issueMultiple",
    contractPayload: {
    instances: instances,
    },
  };
  
  return new Promise((resolve, reject) => {
    hive.broadcast.customJson(
      ACTIVEKEY,
      [CONTRACT_CREATOR],
      [],
      "ssc-mainnet-hive",
      JSON.stringify(json),
      function (err, result) {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      }
    );
  });
}

module.exports = {
  mintNfts
}