const basePath = process.cwd();
const fs = require("fs");
const {
  CONTRACT_CREATOR,
  UTILITY_TOKEN_SYMBOL,
  ACTIVEKEY
} = require('../config.js');

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