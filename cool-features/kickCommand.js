const { errorEmbed, successEmbed } = require("../utils/embeds.js");
const serverPrefix = require("../prifix.js");
const { PermissionFlagsBits, EmbedBuilder } = require("discord.js");

const kickCommand = async message => {
  if (
    message.content.startsWith(`${serverPrefix}k`) ||
    message.content.startsWith(`${serverPrefix}kick`)
  ) {
    try {
      // Check if the user has permission to kick members
      if (!message.member.permissions.has(PermissionFlagsBits.KickMembers)) {
        const noPermEmbed = errorEmbed("You don't have permissions bro.");
        return message.reply({ embeds: [noPermEmbed] });
      }

      const args = message.content
        .slice(
          serverPrefix.length +
            (message.content.startsWith(`${serverPrefix}kick`) ? 4 : 1)
        )
        .trim()
        .split(/ +/g);
      const mentionedUser = message.mentions.members.first();

      // Function to send the kick guide embed
      const sendKickGuide = () => {
        const kickGuideEmbed = new EmbedBuilder()
          .setTitle("🍃  Guide")
          .setColor(0x54ff32)
          .setDescription(
            `**Usage:**\n${serverPrefix}k @user\n${serverPrefix}k @user reason\n${serverPrefix}kick @user reason\n\n**Examples:**\n${serverPrefix}kick @user Spamming\n${serverPrefix}k @user Rule violations`
          )
          .setFooter({ text: "Mention a user to kick them." });
        return message.reply({ embeds: [kickGuideEmbed] });
      };

      // Check for invalid input formats (e.g., missing spaces)
      const commandRegex = new RegExp(
        `^${serverPrefix}(kick|k)\\s+<@!?(\\d+)>\\s*(.*)?$`
      );
      if (!commandRegex.test(message.content)) {
        return sendKickGuide();
      }

      // If no user is mentioned, send the guide
      if (!mentionedUser) {
        return sendKickGuide();
      }

      // Check if the bot can kick the user
      if (!mentionedUser.kickable) {
        const cantKickEmbed = new EmbedBuilder()
          .setTitle("<:cross:1310179339005988945>  Unsuccessful")
          .setColor(0xff0320)
          .setDescription(`User is immune, can't kick.`);
        return message.reply({ embeds: [cantKickEmbed] });
      }

      // Parse the reason
      const reason = args.slice(1).join(" ") || "No reason provided";

      // Kick the user
      await mentionedUser.kick(reason);

      // Send success embed
      const successKickEmbed = new EmbedBuilder()
        .setTitle("<:tick:1310179325152067676>  Success")
        .setColor(0x54ff32)
        .setDescription(
          `**Successfully kicked  <@${mentionedUser.user.id}>.**\n\nReason: ${reason}.`
        );

      await message.reply({ embeds: [successKickEmbed] });
    } catch (error) {
      console.error("Error in kick command:", error);
      const errorKickEmbed = errorEmbed(
        "An error occurred while trying to kick the user."
      );
      await message.reply({ embeds: [errorKickEmbed] });
    }
  }
};

module.exports = kickCommand;
