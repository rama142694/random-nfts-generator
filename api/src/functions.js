const fs = require("fs");
const path = require("path");
const { createCanvas, loadImage } = require("canvas");
const isLocal = typeof process.pkg === "undefined";
const basePath = isLocal ? process.cwd() : path.dirname(process.execPath);
const buildDir = `${basePath}/build`;
const layersDir = `${basePath}/layers`;
const {
  layersOrder,
  format,
  baseUri,
  description,
  background,
  uniqueDnaTorrance,
  editionSize,
} = require(`${basePath}/src/config.js`);
const console = require("console");
const canvas = createCanvas(format.width, format.height);
const ctx = canvas.getContext("2d");
var metadataList = [];
var attributesList = [];
var dnaList = [];

const buildSetup = () => {
  if (fs.existsSync(buildDir)) {
    fs.rmdirSync(buildDir, { recursive: true });
  }
  fs.mkdirSync(buildDir);
};

const cleanName = (_str) => {
  let name = _str.slice(0, -4);
  return name;
};

const getElements = (path) => {
    let elementsByRarities = []
   fs
    .readdirSync(path).forEach((rarity) => {
        let rarityObject = {
            name: rarity,
            elements: fs.readdirSync(path + rarity)
            .filter((item) =>{
                return !/(^|\/)\.[^\/\.]/g.test(item);
              })
              .map((i) => {
                return {
                  name: cleanName(i),
                  path: `${path + rarity + "/"}${i}`,
                };
              })
        }
        
        elementsByRarities.push(rarityObject);
    });

    return elementsByRarities;
};

const layersSetup = (layersOrder) => {
  const layers = layersOrder.map((layerObj, index) => ({
    id: index,
    name: layerObj.name,
    elements: getElements(`${layersDir}/${layerObj.name}/`),
  }));
  return layers;
};

const saveImage = (_editionCount) => {
  fs.writeFileSync(
    `${buildDir}/${_editionCount}.png`,
    canvas.toBuffer("image/png")
  );
};

const genColor = () => {
  let hue = Math.floor(Math.random() * 360);
  let pastel = `hsl(${hue}, 100%, ${background.brightness})`;
  return pastel;
};

const drawBackground = () => {
  ctx.fillStyle = genColor();
  ctx.fillRect(0, 0, format.width, format.height);
};

const addMetadata = (_dna, _edition) => {
  let dateTime = Date.now();
  let tempMetadata = {
    dna: _dna.join(""),
    name: `#${_edition}`,
    description: description,
    image: `${baseUri}/${_edition}.png`,
    edition: _edition,
    date: dateTime,
    attributes: attributesList,
    compiler: "HashLips Art Engine",
  };
  metadataList.push(tempMetadata);
  attributesList = [];
};

const addAttributes = (_element) => {
  let selectedElement = _element.layer.selectedElement;
  attributesList.push({
    trait_type: _element.layer.name,
    rarity: _element.layer.rarity,
    value: selectedElement.name,
  });
};

const loadLayerImg = async (_layer) => {
  return new Promise(async (resolve) => {
    const image = await loadImage(`${_layer.selectedElement.path}`);
    resolve({ layer: _layer, loadedImage: image });
  });
};

const drawElement = (_element) => {
  ctx.drawImage(_element.loadedImage, 0, 0, format.width, format.height);
  addAttributes(_element);
};

const constructLayerToDna = (_dna = [], _layers = []) => {
  let mappedDnaToLayers = _layers.map((layer, index) => {
    let selectedElement = layer.elements.filter((rarity) => rarity.name === _dna[index].rarity)[0].elements[_dna[index].part];
    return {
      name: layer.name,
      rarity: _dna[index].rarity,
      selectedElement: selectedElement,
    };
  });
  return mappedDnaToLayers;
};

const isDnaUnique = (_DnaList = [], _dna = []) => {
  let foundDna = _DnaList.find((i) => i.join("") === _dna.join(""));
  return foundDna == undefined ? true : false;
};

const selectRarity = (rarities) => {
    if(rarities.length == 1) return rarities[0].name;
    else {
        let selectedRarity;
        const randomNumber = Math.random();
        
        if(randomNumber <= 0.5)
        selectedRarity = "original";
        else if(randomNumber <= 0.7)
        selectedRarity = "rare";
        else if(randomNumber <= 0.9)
        selectedRarity = "epic";
        else selectedRarity = "legendary";

        let hasRarity = rarities.filter((rarity) => rarity.name === selectedRarity).length;
        
        if(hasRarity >= 1) return selectedRarity;
        else return selectRarity(rarities);
    }
}

const createDna = (_layers) => {
  let randNum = [];
  _layers.forEach((rarities) => {
    let randomRarity = selectRarity(rarities.elements);
    let selectedRarity = rarities.elements.filter((rarity) => rarity.name === randomRarity)[0].elements;
    let selectedPart = Math.floor(Math.random() * selectedRarity.length);
    randNum.push({
      rarity: randomRarity,
      part: selectedPart
    });
  });
  return randNum;
};

const reWriteDna = (_dna) => {
  const newDna = _dna.map((dnaPart) => {
    if(dnaPart.rarity === "original") return 0 + "" + dnaPart.part;
    else if(dnaPart.rarity === "rare") return 1 + "" + dnaPart.part;
    else if(dnaPart.rarity === "epic") return 2 + "" + dnaPart.part;
    else return 3 + "" + dnaPart.part;
  })
  return newDna;
}

const writeMetaData = (_data) => {
  fs.writeFileSync(`${buildDir}/_metadata.json`, _data);
};

const saveMetaDataSingleFile = (_editionCount) => {
  fs.writeFileSync(
    `${buildDir}/${_editionCount}.json`,
    JSON.stringify(metadataList.find((meta) => meta.edition == _editionCount))
  );
};

const mintNfts = async () => {
  let editionCount = 1;
  let failedCount = 0;
  const layers = layersSetup(layersOrder);
  while (editionCount <= editionSize) {
    let newDna = createDna(layers);
    let numericDna = reWriteDna(newDna);
    if (isDnaUnique(dnaList, numericDna)) {
      let results = constructLayerToDna(newDna, layers);
      let loadedElements = [];

      results.forEach((layer) => {
        loadedElements.push(loadLayerImg(layer));
      });

      await Promise.all(loadedElements).then((elementArray) => {
        ctx.clearRect(0, 0, format.width, format.height);
        if (background.generate) {
          drawBackground();
        }
        elementArray.forEach((element) => {
          drawElement(element);
        });
        saveImage(editionCount);
        addMetadata(numericDna, editionCount);
        saveMetaDataSingleFile(editionCount);
        console.log(`Created edition: ${editionCount}, with DNA: ${numericDna}`);
      });

      dnaList.push(numericDna);
      editionCount++;
    } else {
      console.log("DNA exists!");
      failedCount++;
      if (failedCount >= uniqueDnaTorrance) {
        console.log(
          `You need more layers or elements to generate ${editionSize} artworks!`
        );
        process.exit();
      }
    }
  }
  writeMetaData(JSON.stringify(metadataList));
};

mintNfts();

module.exports = {
    mintNfts,
    buildSetup
}