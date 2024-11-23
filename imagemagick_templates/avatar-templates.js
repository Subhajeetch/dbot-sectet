const sharp = require("sharp");
const axios = require("axios");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid"); // Importing uuid

const downloadImage = async (url, filepath) => {
  const response = await axios({
    url,
    method: "GET",
    responseType: "arraybuffer"
  });
  fs.writeFileSync(filepath, response.data);
};

const generateLoveImage = async (
  avatarURL1,
  avatarURL2,
  outputPath,
  callback
) => {
  try {
    // Generate unique file names for the avatar images
    const avatarPath1 = `avatar1_${uuidv4()}.png`;
    const avatarPath2 = `avatar2_${uuidv4()}.png`;

    // Download the avatar images
    await downloadImage(avatarURL1, avatarPath1);
    await downloadImage(avatarURL2, avatarPath2);

    // Define dimensions for the canvas and avatar positions
    const canvasWidth = 1012;
    const canvasHeight = 512;
    const avatarSize = 512;

    // Resize both avatar images to the same dimensions
    const resizedAvatar1Buffer = await sharp(avatarPath1)
      .resize(avatarSize, avatarSize)
      .toBuffer();

    const resizedAvatar2Buffer = await sharp(avatarPath2)
      .resize(avatarSize, avatarSize)
      .toBuffer();

    // Check the dimensions of the resized avatars
    const avatar1Metadata = await sharp(resizedAvatar1Buffer).metadata();
    const avatar2Metadata = await sharp(resizedAvatar2Buffer).metadata();

    const user1X = -5;
    const user1Y = (canvasHeight - avatarSize) / 2;
    const user2X = canvasWidth - avatarSize - -5;
    const user2Y = (canvasHeight - avatarSize) / 2;

    // Create the composite image with resized avatars
    await sharp({
      create: {
        width: canvasWidth,
        height: canvasHeight,
        channels: 3,
        background: { r: 255, g: 255, b: 255 }
      }
    })
      .composite([
        { input: resizedAvatar1Buffer, left: user1X, top: user1Y },
        { input: resizedAvatar2Buffer, left: user2X, top: user2Y }
      ])
      .toFile(outputPath);

    // Clean up temporary files
    fs.unlinkSync(avatarPath1);
    fs.unlinkSync(avatarPath2);

    // Call the callback with no errors
    callback(null);
  } catch (err) {
    console.error("Error generating the love image with Sharp:", err);
    callback(err);
  }
};

module.exports = generateLoveImage;