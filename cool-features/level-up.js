const fs = require("fs");
const axios = require("axios");
const levelUpCard = require("../imagemagick_templates/levelUpCard.js");
const serverPrifix = require("../prifix.js");

const levelUp = async (message) => {
  if (message.content === `${serverPrifix}lv`) {
    try {
      const currentExp = 1400;
      const maxExp = 8500;
      const percentage = (currentExp / maxExp) * 100;
      const progress = (percentage / 100) * 770;

      const avatarURL = message.author.displayAvatarURL({
        format: "png",
        size: 128,
      });

      const response = await axios({
        url: avatarURL,
        responseType: "arraybuffer",
      });

      const avatarPath = "avatar.png";
      fs.writeFileSync(avatarPath, response.data);

      const outputPath = "ping.png";

      // Call generateImage with options and handle the callback
      levelUpCard(
        {
          avatarPath,
          currentExp,
          maxExp,
          username: message.author.username,
          outputPath,
          progress,
        },
        (err) => {
          if (err) {
            console.error("Error generating image:", err);
            message.reply("Failed to generate the image.");
            return;
          }

          message.reply({ files: [outputPath] });
        }
      );
    } catch (error) {
      console.error("Error:", error);
      message.reply("Failed to process your request.");
    }
  }
};

module.exports = levelUp;