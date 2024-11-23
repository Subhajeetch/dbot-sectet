const im = require("imagemagick");
const fs = require("fs");

const levelUpCard = (options, callback) => {
  const {
    avatarPath,
    currentExp,
    maxExp,
    username,
    outputPath,
    progress,
  } = options;

  im.convert(
    [
      "-size", "1280x400", "gradient:#ff7f0f-#ff04ff", // Gradient background
      "-gravity", "NorthWest",

      // Avatar background
      "-fill", "#353535",
      "-draw", "roundrectangle 40,40 280,280 20,20",

      // Draw the avatar
      "-fill", "white",
      "-draw", `image over 60,60 200,200 '${avatarPath}'`,

      // Draw the username
      "-font", "fonts/Poppins-SemiBold.ttf",
      "-pointsize", "58",
      "-fill", "#353535",
      "-stroke", "#353535",
      "-strokewidth", "1",
      "-draw", `text 300,66 '${username.toUpperCase()}'`,

      // Draw a rectangle
      "-stroke", "#353535",
      "-strokewidth", "1",
      "-fill", "#353535",
      "-draw", "rectangle 300,138 700,143",

      // Draw level
      "-pointsize", "40",
      "-draw", `text 300,200 'Level: 24'`,

      // Draw experience
      "-draw", `text 550,200 'EXP: ${(Math.round(currentExp) / 1000).toFixed(1)}k/${(Math.round(maxExp) / 1000).toFixed(1)}k'`,

      // Draw rank
      "-draw", `text 900,200 'Rank: 17'`,

      // Progress bar background
      "-fill", "#353535",
      "-strokewidth", "3",
      "-draw", `roundrectangle 300,280 1070,322 10,10`,

      // Progress bar foreground
      "-fill", "#97FF01",
      "-draw", `roundrectangle 300,280 ${300 + progress},322 10,10`,

      // Footer text
      "-font", "fonts/Poppins-Thin.ttf",
      "-stroke", "black",
      "-strokewidth", "1",
      "-fill", "black",
      "-pointsize", "24",
      "-draw", `text 961,365 'Powered by @Animekun AI'`,

      // Output file
      outputPath,
    ],
    (err) => {
      fs.unlinkSync(avatarPath); // Clean up the avatar file
      callback(err); // Pass the error (if any) to the callback
    }
  );
};

module.exports = levelUpCard;