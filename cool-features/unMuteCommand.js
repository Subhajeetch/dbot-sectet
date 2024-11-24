const { errorEmbed, successEmbed } = require("../utils/embeds.js");
const serverPrefix = require("../prifix.js");
const { PermissionFlagsBits, EmbedBuilder } = require("discord.js");

const unmuteCommand = async message => {
  if (
    message.content.startsWith(`${serverPrefix}um`) ||
    message.content.startsWith(`${serverPrefix}unmute`)
  ) {
    try {
      // Check if the user has permission to timeout members
      if (
        !message.member.permissions.has(PermissionFlagsBits.ModerateMembers)
      ) {
        const noPermEmbed = errorEmbed("You don't have permissions bro.");
        return message.reply({ embeds: [noPermEmbed] });
      }

      const args = message.content
        .slice(
          serverPrefix.length +
            (message.content.startsWith(`${serverPrefix}unmute`) ? 6 : 2)
        )
        .trim()
        .split(/ +/g);
      const mentionedUser = message.mentions.members.first();

      // If no user is mentioned, send the unmute guide
      const sendUnmuteGuide = () => {
        const unmuteGuideEmbed = new EmbedBuilder()
          .setTitle("🍃  Unmute Guide")
          .setColor(0x54ff32)
          .setDescription(
            `**Usage:**\n${serverPrefix}unmute @user\n${serverPrefix}um @user`
          )
          .setFooter({ text: "Mention a user to unmute them." });
        return message.reply({ embeds: [unmuteGuideEmbed] });
      };

      // Check for invalid input formats (e.g., missing spaces)
      const commandRegex = new RegExp(
        `^${serverPrefix}(unmute|um)\\s+<@!?(\\d+)>$`
      );
      if (!commandRegex.test(message.content)) {
        return sendUnmuteGuide();
      }

      // If no user is mentioned, show guide
      if (!mentionedUser) {
        return sendUnmuteGuide();
      }

      // Check if the user is muted
      if (!mentionedUser.isCommunicationDisabled()) {
        const notMutedEmbed = errorEmbed("User is not muted bro.");
        return message.reply({ embeds: [notMutedEmbed] });
      }

      // Check if the bot can unmute the user
      if (!mentionedUser.moderatable) {
        const cantUnmuteEmbed = errorEmbed(
          "I cannot unmute this user. Check my permissions and role hierarchy."
        );
        return message.reply({ embeds: [cantUnmuteEmbed] });
      }

      // Unmute the user
      await mentionedUser.timeout(null);

      // Send success embed
      const successUnmuteEmbed = successEmbed(
        `Successfully unmuted  <@${mentionedUser.user.id}>.`
      );
      await message.reply({ embeds: [successUnmuteEmbed] });
    } catch (error) {
      console.error("Error in unmute command:", error);
      const errorUnmuteEmbed = errorEmbed(
        "An error occurred while trying to unmute the user."
      );
      await message.reply({ embeds: [errorUnmuteEmbed] });
    }
  }
};

module.exports = unmuteCommand;
