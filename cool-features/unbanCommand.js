const { errorEmbed, successEmbed } = require("../utils/embeds.js");
const serverPrefix = require("../prifix.js");
const { PermissionFlagsBits, EmbedBuilder } = require("discord.js");

const unbanCommand = async message => {
  if (
    message.content.startsWith(`${serverPrefix}ub`) ||
    message.content.startsWith(`${serverPrefix}unban`)
  ) {
    try {
      // Check if the user has permission to ban/unban members
      if (!message.member.permissions.has(PermissionFlagsBits.BanMembers)) {
        const noPermEmbed = errorEmbed("You don't have permissions bro.");
        return message.reply({ embeds: [noPermEmbed] });
      }

      const args = message.content
        .slice(
          serverPrefix.length +
            (message.content.startsWith(`${serverPrefix}unban`) ? 5 : 2)
        )
        .trim()
        .split(/ +/g);

      // Function to send the unban guide embed
      const sendUnbanGuide = () => {
        const unbanGuideEmbed = new EmbedBuilder()
          .setTitle("🍃 Guide")
          .setColor(0x54ff32)
          .setDescription(
            `**Usage:**\n${serverPrefix}unban @user or userID\n${serverPrefix}ub @user or userID\n\n**Examples:**\n${serverPrefix}ub @user\n${serverPrefix}unban @user\n${serverPrefix}ub 5887437874478854`
          )
          .setFooter({
            text: "Provide a user ID or mention a user to unban them."
          });
        return message.reply({ embeds: [unbanGuideEmbed] });
      };

      // Check for invalid input
      if (!args.length) {
        return sendUnbanGuide();
      }

      // Parse the user ID or mention
      const userId = args[0].replace(/[<@!>]/g, ""); // Clean the input to extract only the user ID

      // Check if the user ID is valid
      if (!/^\d+$/.test(userId)) {
        return sendUnbanGuide();
      }

      // Fetch the ban list to find the user
      const banList = await message.guild.bans.fetch();
      const bannedUser = banList.get(userId);

      if (!bannedUser) {
        const notFoundEmbed = new EmbedBuilder()
          .setTitle("<:cross:1310179339005988945>  Unsuccessful")
          .setColor(0xff0320)
          .setDescription(`Cannot find the user in the banned list.`);

        return message.reply({ embeds: [notFoundEmbed] });
      }

      // Unban the user
      await message.guild.members.unban(userId);

      // Send success embed

      const successUnbanEmbed = new EmbedBuilder()
        .setTitle("<:tick:1310179325152067676>  Success")
        .setColor(0x54ff32)
        .setDescription(`Successfully unbanned  <@${userId}>.`);
        
      await message.reply({ embeds: [successUnbanEmbed] });
    } catch (error) {
      console.error("Error in unban command:", error);
      const errorUnbanEmbed = errorEmbed(
        "An error occurred while trying to unban the user."
      );
      await message.reply({ embeds: [errorUnbanEmbed] });
    }
  }
};

module.exports = unbanCommand;
