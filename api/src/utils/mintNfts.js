const basePath = process.cwd();
const fs = require("fs");
var hivejs = require("@hiveio/hive-js");
const account = "Your Account";
const CONTRACT_CREATOR = "Your NFT Contract";
const UTILITY_TOKEN_SYMBOL = "Your Token Simbol";

let rawdata = fs.readFileSync(`${basePath}/build/json/_metadata.json`);
let data = JSON.parse(rawdata);

async function mintNfts(hive, user, quantity) {
    let instances = [];
  
    const properties = {
      NAME: "Gear Tower",
      TYPE: "gear",
      LVL: 1,
    };
  
    const instance = {
      symbol: UTILITY_TOKEN_SYMBOL,
      to: user,
      feeSymbol: "PAL",
      properties,
    };
  
    for (let index = 0; index < quantity; index++) {
      instances.push(instance);
    }
  
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

  //mintNfts(hivejs, account, data.length);