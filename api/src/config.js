//For mint and search your nfts.
const CONTRACT_CREATOR = "The contract that create the nfts, if you dont have a contract is your hive account name";
const UTILITY_TOKEN_SYMBOL = "The symbol of your nfts";
const ACTIVEKEY = 'Your Active private key from your hive account';

//Saving in ipfs.
const IpfsToken = 'Your token from NFT Storage.';
const baseUri = "ipfs://NewUriToReplace";


//Creating the NFT Images
const layersOrder = [
  { name: "Layer 1" },
  { name: "Layer 2" },
  { name: "Layer 3" },
];

const raritiesProbabilities = {
  original: 0.5,
  rare: 0.7,
  epic: 0.95,
}

const format = {
  width: 512,
  height: 512,
};

const background = {
  generate: true,
  brightness: "80%",
};

const uniqueDnaTorrance = 10000;

module.exports = {
  CONTRACT_CREATOR,
  UTILITY_TOKEN_SYMBOL,
  ACTIVEKEY,
  IpfsToken,
  layersOrder,
  format,
  baseUri,
  background,
  uniqueDnaTorrance,
  raritiesProbabilities
};