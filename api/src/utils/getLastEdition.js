const axios = require('axios');

function isNullOrEmpty(variable) {
    return variable === null || variable === undefined;
}

async function axiosRequest({ table, query, offset }) {
    let config = {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
      },
    };

    let body = JSON.stringify([
      {
        method: "find",
        jsonrpc: "2.0",
        params: {
          contract: 'nft',
          table: table,
          query: query,
          limit: 1000,
          offset: offset,
          indexes: [],
        },
        id: 1,
      },
    ]);

    return await axios.post('https://engine.rishipanthee.com/contracts', body, config).then((data) => {
      return data;
    });
}

async function queryContract({ table, query = {} }, offset = 0) {
    let response = await axiosRequest({ table, query, offset });

    if (
      response &&
      response.data !== undefined &&
      response.data !== null &&
      !isNullOrEmpty(response.data[0].result)
    )
      return response.data[0].result;


    return false;
}

async function getLastNftMinted() {
    return await new Promise(async (resolve) => {
      (async () => {
        let complete = false;
        let nfts = [];
        let offset = 0;

        while (!complete) {
          let get_nfts = await queryContract(
            {
              contract: 'nft',
              table: 'RAMANFTS' + 'instances',
              query: {
                
              },
            },
            offset
          ).catch((err) => {
            console.log("Error getting data from Hive ENGINE :>>", err);
          });
          if (get_nfts !== false) {
            nfts = nfts.concat(get_nfts);
            offset += 1000;

            if (get_nfts.length !== 1000) {
              complete = true;
            }
          } else {
            complete = true;
          }
        }

        let t = [];

        for (let i = 0; i < nfts.length; i++) {
          let nft = {
            id: nfts[i]._id,
            properties: nfts[i].properties,
            owner: nfts[i].account,
          };
          t.push(nft);
        }

        resolve(t);
      })();
    }
    ).then(async value => {
        if(value.length === 0)
            return 0;

        let greaterNft;
        value.forEach((nft, index) => {
            let edition = nft.properties.name.replace('#','');
            edition = parseFloat(edition);

            if(index === 0){
                greaterNft = edition;
            }
            else if(edition > greaterNft){
                greaterNft = edition;
            }
        });
        return greaterNft;
    });
}

module.exports = {
    getLastNftMinted
}