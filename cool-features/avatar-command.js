const { EmbedBuilder } = require("discord.js");
const serchUser = require("../utils/searchUser.js");
const serverPrifix = require("../prifix.js");
const generateLoveImage = require("../imagemagick_templates/avatar-templates.js");
const { errorEmbed } = require("../utils/embeds.js");

const getAvatarURL = member => {
  if (member instanceof Object && member.guild) {
    // Fetch the guild-specific avatar if available
    return (
      member.avatarURL({ dynamic: true, size: 4096 }) ||
      member.user.displayAvatarURL({ dynamic: true, size: 4096 })
    );
  }
  // Fallback to the global avatar if not part of a guild
  return member.displayAvatarURL({ dynamic: true, size: 4096 });
};

const avatarCommand = async message => {
  if (
    message.content.startsWith(`${serverPrifix}av`) ||
    message.content.startsWith(`${serverPrifix}avatar`)
  ) {
    try {
      const args = message.content.split(" ").slice(1); // Get the arguments after the command

      // Check if the number of mentions or usernames is more than 2
      if (message.mentions.users.size > 2 || args.length > 2) {
        const provideTwoUserEmbed = errorEmbed("Please provide only 2 users.");
        await message.reply({ embeds: [provideTwoUserEmbed] });
        return;
      }

      let targetUser1, targetUser2;

      if (message.mentions.users.size >= 2) {
        targetUser1 = message.mentions.users.first();
        targetUser2 = message.mentions.users.last();
      } else if (args.length >= 2) {
        const username1 = args[0];
        const username2 = args[1];

        targetUser1 = await serchUser(message.guild, username1);
        targetUser2 = await serchUser(message.guild, username2);

        if (!targetUser1 || !targetUser2) {
          const cantFindUserEmbed = errorEmbed(
            "Could not find users. Please mention or provide valid usernames."
          );
          await message.reply({ embeds: [cantFindUserEmbed] });
          return;
        }
      } else if (args.length === 1) {
        // If only one argument is provided, try to fetch the user by username
        if (message.mentions.users.size > 0) {
          targetUser1 = message.mentions.users.first();
        } else {
          const username = args[0];
          targetUser1 = await serchUser(message.guild, username);

          if (!targetUser1) {
            const noUserEmbed = errorEmbed(
              `Username "**${username}**" doesn't exist.`
            );
            await message.reply({ embeds: [noUserEmbed] });
            return;
          }
        }

        targetUser2 = null; // No second user for love image
      } else {
        // Case: No arguments, use author's avatar
        targetUser1 = message.author;
      }

      if (targetUser2) {
        const avatarURL1 = getAvatarURL(targetUser1);
        const avatarURL2 = getAvatarURL(targetUser2);

        const outputPath = "output-avatar.png";

        // Send "Generating..." embed
        const generatingEmbed = new EmbedBuilder()
          .setColor("#FFA500")
          .setDescription("Generating image...");

        const generatingMessage = await message.reply({
          embeds: [generatingEmbed]
        });

        generateLoveImage(avatarURL1, avatarURL2, outputPath, async err => {
          if (err) {
            console.error("Error generating the love image:", err);
            const wentWrongEmbed = errorEmbed(
              "Something went wrong while generating the image."
            );
            generatingMessage.edit({ embeds: [wentWrongEmbed] });
            return;
          }

          const finalEmbed = new EmbedBuilder()
            .setColor("#34dd7b")
            .setImage(`attachment://${outputPath}`);

          // Edit the original message with the final embed and attach the file
          await generatingMessage.edit({
            embeds: [finalEmbed],
            files: [outputPath]
          });
        });
      } else {
        // Case: Only one avatar
        const avatarURL = getAvatarURL(targetUser1);

        const embed = new EmbedBuilder()
          .setColor("#00FFFF")
          .setImage(avatarURL);

        await message.reply({ embeds: [embed] });
      }
    } catch (error) {
      console.error("Error fetching avatars or generating image:", error);
      const unableToFetchEmbed = errorEmbed("Unable to fetch the avatar.");
      await message.reply({ embeds: [unableToFetchEmbed] });
    }
  }
};

module.exports = avatarCommand;
