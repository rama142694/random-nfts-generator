const baseUri = "ipfs://NewUriToReplace";

const layersOrder = [
  { name: "Background" },
  { name: "Eyeball" },
  { name: "Eye color" },
  { name: "Iris" },
  { name: "Shine" },
  { name: "Bottom lid" },
  { name: "Top lid" },
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

const editionSize = 5;

module.exports = {
  layersOrder,
  format,
  editionSize,
  baseUri,
  background,
  uniqueDnaTorrance,
  raritiesProbabilities
};