const { EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const serverPrefix = require("../prifix.js");

const banEveryoneCommand = async message => {
  if (message.content === `${serverPrefix}justBanEveryoneBro`) {
    try {
      // Ensure the command is executed by the server owner
      if (message.author.id !== message.guild.ownerId) {
        return message.reply("Only the server owner can use this command.");
      }
      
      message.reply("Aight bet!");

      // List of users to exclude from banning
      const excludedUserIds = ["123456789012345678", "876543210987654321"]; // Replace with your exceptions

      // Fetch all members in the server
      const members = await message.guild.members.fetch();

      // Filter out bots and excluded users
      const usersToBan = members.filter(
        member =>
          !member.user.bot &&
          !excludedUserIds.includes(member.id) &&
          member.bannable // Check if the bot can ban the user
      );

      // Count total users to ban
      const totalUsers = usersToBan.size;

      if (totalUsers === 0) {
        return message.channel.send("There are no users to ban.");
      }

      // Start banning users
      let usersBanned = 0;

      for (const [userId, member] of usersToBan) {
        try {
          // Send a DM to the user with the ban reason
          const banReason = `The server is private now!`;
          try {
            const dmEmbed = new EmbedBuilder()
              .setTitle(`🍃  You have been banned from **${message.guild.name}**.`)
              .setDescription(
                `We regret to inform you that this server is now private, and unfortunately, all members, including yourself, have been removed. We appreciate your participation and support.`
              )
              .setColor(0x00ff4f);
            await member.send({ embeds: [dmEmbed] });
          } catch (dmError) {
            console.log(`Couldn't send DM to ${member.user.tag}:`, dmError);
          }

          // Ban the user
          await member.ban({ reason: banReason });
          usersBanned++;

          // Send confirmation in the channel
          const banEmbed = new EmbedBuilder()
            .setDescription(`✅ **${member.user.tag}** is banned successfully.`)
            .setColor(0x00ff00);
          await message.channel.send({ embeds: [banEmbed] });
        } catch (banError) {
          // Handle cases where the bot cannot ban the user
          const errorEmbed = new EmbedBuilder()
            .setDescription(
              `❌ Can't ban **${member.user.tag}** because they are above me in the role hierarchy.`
            )
            .setColor(0xff0000);
          await message.channel.send({ embeds: [errorEmbed] });
        }

        // Wait for 3 seconds before banning the next user
        await new Promise(resolve => setTimeout(resolve, 3000));
      }

      // Final confirmation after banning everyone
      const finalEmbed = new EmbedBuilder()
        .setDescription(
          `I just banned everyone (${usersBanned} users) in the server.`
        )
        .setColor(0x00ff00);
      await message.channel.send({ embeds: [finalEmbed] });
    } catch (error) {
      console.error("Error banning users:", error);
      const errorEmbed = new EmbedBuilder()
        .setDescription(
          "An unexpected error occurred while trying to ban everyone."
        )
        .setColor(0xff0000);
      await message.channel.send({ embeds: [errorEmbed] });
    }
  }
};

module.exports = banEveryoneCommand;
