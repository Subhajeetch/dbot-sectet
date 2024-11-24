const { errorEmbed, successEmbed } = require("../utils/embeds.js");
const serverPrefix = require("../prifix.js");
const { PermissionFlagsBits, EmbedBuilder } = require("discord.js");

const purgeCommand = async message => {
  if (message.content.startsWith(`${serverPrefix}p`)) {
    // Check if the user has "Manage Messages" permission
    if (!message.member.permissions.has(PermissionFlagsBits.ManageMessages)) {
      const noPermEmbed = errorEmbed("You don't have permissions bro.");
      return message.reply({ embeds: [noPermEmbed] });
    }
    try {
      // Extract command arguments
      const args = message.content
        .slice(serverPrefix.length + 1)
        .trim()
        .split(/ +/g);

      // Function to send the purge guide embed
      const sendPurgeGuide = () => {
        const provideNumEmbed = new EmbedBuilder()
          .setTitle(`🍃 Purge Guide`)
          .setColor(0x54ff32)
          .setDescription(
            `**Normal purge:**\n${serverPrefix}p 5\n${serverPrefix}purge 5.\n\n**Specific user purge:**\n${serverPrefix}p 5 @user\n${serverPrefix}purge 5 @user.`
          )
          .setFooter({ text: "Provide a number between 2 - 300." });
        return message.channel.send({ embeds: [provideNumEmbed] });
      };

      // If no arguments, send the guide
      if (!args[0]) {
        return sendPurgeGuide();
      }

      // Parse the number and check if it's valid
      const numberMatch = args[0].match(/^(\d+)/);
      if (!numberMatch) {
        return sendPurgeGuide();
      }

      const numberToDelete = parseInt(numberMatch[1], 10);
      if (numberToDelete < 2 || numberToDelete > 300) {
        return sendPurgeGuide();
      }

      // Check for a valid mention
      let targetUser = null;
      const mentionMatch = args[0].match(/<@!?(\d+)>$/);
      if (mentionMatch) {
        targetUser = await message.client.users
          .fetch(mentionMatch[1])
          .catch(() => null);
      } else if (args[1]) {
        if (args[1].match(/^<@!?\d+>$/)) {
          targetUser = message.mentions.users.first();
        } else {
          return sendPurgeGuide();
        }
      }

      // If there's any text after the number that's not a valid mention, send the guide
      if (args[0].length > numberMatch[0].length && !mentionMatch) {
        return sendPurgeGuide();
      }

      // Initialize the count for deleted messages
      let totalMessagesDeleted = 0;

      // Fetch messages in batches of 100
      while (totalMessagesDeleted < numberToDelete) {
        const fetchLimit = Math.min(100, numberToDelete - totalMessagesDeleted);
        const fetchedMessages = await message.channel.messages.fetch({
          limit: fetchLimit
        });

        // Filter messages by the mentioned user if applicable
        const messagesToDelete = targetUser
          ? fetchedMessages.filter(msg => msg.author.id === targetUser.id)
          : fetchedMessages;

        // If no messages matched the filter, stop the loop
        if (!messagesToDelete.size) break;

        // Bulk delete the filtered messages
        await message.channel.bulkDelete(messagesToDelete, true);
        totalMessagesDeleted += messagesToDelete.size;

        // If fewer than fetchLimit messages were fetched, stop the loop
        if (fetchedMessages.size < fetchLimit) break;
      }

      // Send a DM to the user confirming the purge
      const successDMEmbed = successEmbed(
        `Successfully purged ${totalMessagesDeleted} messages.`
      );
      await message.author.send({ embeds: [successDMEmbed] });
    } catch (error) {
      console.error("Error purging messages:", error);
      const errorPurgeEmbed = errorEmbed(
        "An error occurred while trying to purge messages. Ensure messages are not older than 14 days."
      );
      await message.channel.send({ embeds: [errorPurgeEmbed] });
    }
  }
};

module.exports = purgeCommand;
