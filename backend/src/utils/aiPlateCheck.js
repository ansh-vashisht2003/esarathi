import Tesseract from "tesseract.js";
import {Jimp} from "jimp";

/* READ NUMBER PLATE TEXT */

export const detectPlateText = async (imagePath) => {
  try {

    const result = await Tesseract.recognize(
      imagePath,
      "eng",
      { logger: () => {} }
    );

    const text = result.data.text
      .replace(/\n/g, "")
      .replace(/\s/g, "")
      .toUpperCase();

    return text;

  } catch (err) {
    console.log("OCR failed");
    return null;
  }
};



/* CHECK IF NUMBER PLATE IS GREEN (EV) */

export const detectGreenPlate = async (imagePath) => {
  try {

    const img = await Jimp.read(imagePath);

    let greenPixels = 0;
    let total = 0;

    img.scan(0, 0, img.bitmap.width, img.bitmap.height, function (x, y, idx) {

      const r = this.bitmap.data[idx];
      const g = this.bitmap.data[idx + 1];
      const b = this.bitmap.data[idx + 2];

      total++;

      if (g > r && g > b && g > 120) {
        greenPixels++;
      }

    });

    const ratio = greenPixels / total;

    return ratio > 0.15; // 15% green → EV plate

  } catch (err) {

    console.log("Green plate detection failed");
    return false;

  }
};



/* MAIN AI CHECK */

export const verifyCarPlate = async (imagePath, actualPlate) => {

  const detectedPlate = await detectPlateText(imagePath);

  const plateMatches =
    detectedPlate &&
    detectedPlate.includes(
      actualPlate.replace(/\s/g, "").toUpperCase()
    );

  const electricPlate = await detectGreenPlate(imagePath);

  return {
    detectedPlate,
    plateMatches,
    electricPlate
  };

};