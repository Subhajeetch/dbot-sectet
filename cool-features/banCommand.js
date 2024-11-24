const { errorEmbed, successEmbed } = require("../utils/embeds.js");
const serverPrefix = require("../prifix.js");
const { PermissionFlagsBits, EmbedBuilder } = require("discord.js");

const banCommand = async message => {
  if (
    message.content.startsWith(`${serverPrefix}b`) ||
    message.content.startsWith(`${serverPrefix}ban`)
  ) {
    try {
      // Check if the user has permission to ban members
      if (!message.member.permissions.has(PermissionFlagsBits.BanMembers)) {
        const noPermEmbed = errorEmbed("You don't have permissions bro.");
        return message.reply({ embeds: [noPermEmbed] });
      }

      const args = message.content
        .slice(
          serverPrefix.length +
            (message.content.startsWith(`${serverPrefix}ban`) ? 3 : 1)
        )
        .trim()
        .split(/ +/g);
      const mentionedUser = message.mentions.members.first();

      // Function to send the ban guide embed
      const sendBanGuide = () => {
        const banGuideEmbed = new EmbedBuilder()
          .setTitle("🍃 Guide")
          .setColor(0x03ff38)
          .setDescription(
            `**Usage:**\n${serverPrefix}b @user\n${serverPrefix}b @user reason\n${serverPrefix}ban @user reason\n\n**Examples:**\n${serverPrefix}ban @user Spamming\n${serverPrefix}b @user Rule violations`
          )
          .setFooter({ text: "Mention a user to ban them." });
        return message.reply({ embeds: [banGuideEmbed] });
      };

      // Check for invalid input formats (e.g., missing spaces)
      const commandRegex = new RegExp(
        `^${serverPrefix}(ban|b)\\s+<@!?(\\d+)>\\s*(.*)?$`
      );
      if (!commandRegex.test(message.content)) {
        return sendBanGuide();
      }

      // If no user is mentioned, send the guide
      if (!mentionedUser) {
        return sendBanGuide();
      }

      // Check if the bot can ban the user
      if (!mentionedUser.bannable) {
        const cantBanEmbed = new EmbedBuilder()
          .setTitle("<:cross:1310179339005988945>  Unsuccessful")
          .setColor(0xff0320)
          .setDescription(`User is immune, can't ban.`);

        return message.reply({ embeds: [cantBanEmbed] });
      }

      // Parse the reason
      const reason = args.slice(1).join(" ") || "No reason provided";

      // Ban the user
      await mentionedUser.ban({ reason });

      // Send success embed
      const successBanEmbed = new EmbedBuilder()
        .setTitle("<:tick:1310179325152067676>  Success")
        .setColor(0x54ff32)
        .setDescription(
          `**Successfully banned  <@${mentionedUser.user.id}>.**\n\nReason: ${reason}.`
        );
      await message.reply({ embeds: [successBanEmbed] });
    } catch (error) {
      console.error("Error in ban command:", error);
      const errorBanEmbed = errorEmbed(
        "An error occurred while trying to ban the user."
      );
      await message.reply({ embeds: [errorBanEmbed] });
    }
  }
};

module.exports = banCommand;
