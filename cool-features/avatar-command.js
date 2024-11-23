const { AttachmentBuilder } = require("discord.js");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const getUserByUserName = require("../utils/getUserByUserName.js"); // Import the function
const generateLoveImage = require("../imagemagick_templates/avatar-templates.js");
const serverPrifix = require("../prifix.js");
const { errorEmbed, successEmbed } = require("../utils/embeds.js");

const avatarCommand = async message => {
  // Check if the command is ?av or ?avatar
  if (
    message.content.startsWith(`${serverPrifix}av`) ||
    message.content.startsWith(`${serverPrifix}avatar`)
  ) {
    try {
      const args = message.content.split(" ").slice(1); // Get the arguments after the command

      // Case 0: Check if the number of mentions or usernames is more than 2
      if (message.mentions.users.size > 2 || args.length > 2) {
        const provideTwoUserEmbed = errorEmbed("Please provide only 2 users.");
        await message.reply({
          embeds: [provideTwoUserEmbed]
        });
        return;
      }

      // Case 1: No arguments, use author's avatar (using buffer, no file system)
      if (args.length === 0) {
        const avatarURL = message.author.displayAvatarURL();

      // Check if the avatar is a GIF by inspecting the URL
      const isGif = avatarURL.endsWith(".gif");

      // Fetch the avatar image using axios
      const response = await axios({
        url: avatarURL,
        responseType: "arraybuffer",
      });

      // Save the avatar image to a buffer
      const avatarBuffer = Buffer.from(response.data, "binary");

      // Set the correct file extension based on whether it's a GIF or PNG
      const fileExtension = isGif ? "gif" : "png";
      const attachment = new AttachmentBuilder(avatarBuffer, {
        name: `avatar.${fileExtension}`,
      });

        return message.reply({ files: [attachment] });
      }

      let targetUser1, targetUser2;

      // Case 2: Two users mentioned or provided by username
      if (message.mentions.users.size >= 2) {
        targetUser1 = message.mentions.users.first();
        targetUser2 = message.mentions.users.last();
      } else if (args.length >= 2) {
        // If two usernames are provided
        const username1 = args[0];
        const username2 = args[1];

        targetUser1 = await getUserByUserName(message.guild, username1);
        targetUser2 = await getUserByUserName(message.guild, username2);

        if (!targetUser1 || !targetUser2) {
          const cantFindUserEmbed = errorEmbed(
            "Could not find users. Please mention or provide valid usernames."
          );
          await message.reply({
            embeds: [cantFindUserEmbed]
          });
          return;
        }
      } else if (args.length === 1) {
        // Case 3: Only one username or mention is provided
        if (message.mentions.users.size > 0) {
          // If a mention is provided, get the user from mentions
          const oneMention = message.mentions.users.first();
          
          const avatarURL = oneMention.displayAvatarURL();

      // Check if the avatar is a GIF by inspecting the URL
      const isGif = avatarURL.endsWith(".gif");

      // Fetch the avatar image using axios
      const response = await axios({
        url: avatarURL,
        responseType: "arraybuffer",
      });

      // Save the avatar image to a buffer
      const avatarBuffer = Buffer.from(response.data, "binary");

      // Set the correct file extension based on whether it's a GIF or PNG
      const fileExtension = isGif ? "gif" : "png";
      const attachment = new AttachmentBuilder(avatarBuffer, {
        name: `avatar.${fileExtension}`,
      });

        return message.reply({ files: [attachment] });
          
        } else {
          // If only a username is provided, search for the user
          const username = args[0];
          targetUser1 = await getUserByUserName(message.guild, username);

          if (!targetUser1) {
            const noUserEmbed = errorEmbed(
              `Username "**${username}**" doesn't exist.`
            );
            await message.reply({
              embeds: [noUserEmbed]
            });
            return;
          }
        }

        targetUser2 = null; // No second user for love image
      }
      
      
      // Case 5: If two users, generate love image
      if (targetUser2) {
        // Fetch avatars for both users
        const avatarURL1 = targetUser1.displayAvatarURL({
          format: "png",
          size: 512,
          dynamic: true
        });
        const avatarURL2 = targetUser2.displayAvatarURL({
          format: "png",
          size: 512,
          dynamic: true
        });

        const response1 = await axios({
          url: avatarURL1,
          responseType: "arraybuffer"
        });
        const response2 = await axios({
          url: avatarURL2,
          responseType: "arraybuffer"
        });

        const avatarPath1 = "avatar1.png";
        const avatarPath2 = "avatar2.png";
        fs.writeFileSync(avatarPath1, response1.data);
        fs.writeFileSync(avatarPath2, response2.data);

        const outputDir = path.dirname("avatar.png");
        if (!fs.existsSync(outputDir)) {
          fs.mkdirSync(outputDir, { recursive: true });
        }

        const outputPath = "avatar.png";

        generateLoveImage(avatarPath1, avatarPath2, outputPath, err => {
          fs.unlinkSync(avatarPath1);
          fs.unlinkSync(avatarPath2);

          if (err) {
            console.error("Error generating the love image:", err);
            const wentWrongEmbed = errorEmbed(
              "Something went wrong while generating the image."
            );
            message.reply({
              embeds: [wentWrongEmbed]
            });
            return;
          }

          const attachment = new AttachmentBuilder(outputPath, {
            name: "avatar.png"
          });
          message
            .reply({ files: [attachment] })
            .then(() => {
              fs.unlinkSync(outputPath);
            })
            .catch(err => {
              console.error("Error sending the image:", err);
              fs.unlinkSync(outputPath);
            });
        });
      } else if (targetUser1) {
        // Case 6: If only one user is provided, send the avatar
        const avatarURL = targetUser1.displayAvatarURL({
          format: "png",
          size: 512,
          dynamic: true
        });

        const response = await axios({
          url: avatarURL,
          responseType: "arraybuffer"
        });
        const avatarBuffer = Buffer.from(response.data, "binary");
        const attachment = new AttachmentBuilder(avatarBuffer, {
          name: "avatar.png"
        });

        return message.reply({ files: [attachment] });
      }
    } catch (error) {
      console.error("Error fetching avatars or generating image:", error);
      const unableToFetchEmbed = errorEmbed(
        "Unable to fetch the avatar or generate the image."
      );
      await message.reply({
        embeds: [unableToFetchEmbed]
      });
    }
  }
};

module.exports = avatarCommand;