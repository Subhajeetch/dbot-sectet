const { errorEmbed, successEmbed } = require("../utils/embeds.js");
const serverPrifix = require("../prifix.js");

const purgeCommand = async message => {
  // Check if the command is ?p or ?purge
  if (
    message.content.startsWith(`${serverPrifix}p`) ||
    message.content.startsWith(`${serverPrifix}purge`)
  ) {
    try {
      // Extract command arguments
      const args = message.content.split(" ").slice(1);

      // Check if the user has "Manage Messages" permission
      if (!message.member.permissions.has("MANAGE_MESSAGES")) {
        const noPermEmbed = errorEmbed(
          "You don't have the permission to purge messages."
        );
        return message.reply({
          embeds: [noPermEmbed]
        });
      }

      // Get the number of messages to delete (must be less than or equal to 300)
      let numberToDelete = parseInt(args[0]);
      if (isNaN(numberToDelete) || numberToDelete < 1 || numberToDelete > 300) {
        const provideNumEmbed = errorEmbed(
          "Please provide a number between `1 - 300`."
        );
        return message.reply({
          embeds: [provideNumEmbed]
        });
      }

      // Determine if a user is mentioned to filter messages by
      let targetUser = null;
      if (args[1] && message.mentions.users.size === 1) {
        targetUser = message.mentions.users.first();
      }

      // Initialize the count for deleted messages
      let totalMessagesDeleted = 0;
      let messagesToDelete = [];

      // Fetch messages in batches of 100 (max Discord allows)
      while (totalMessagesDeleted < numberToDelete) {
        // Calculate the batch size (100 or the remaining messages to delete)
        const fetchLimit = Math.min(100, numberToDelete - totalMessagesDeleted);
        const messages = await message.channel.messages.fetch({
          limit: fetchLimit
        });

        // Filter by the mentioned user if applicable
        if (targetUser) {
          messagesToDelete = messages.filter(
            msg => msg.author.id === targetUser.id
          );
        } else {
          messagesToDelete = messages;
        }

        totalMessagesDeleted += messagesToDelete.size;

        // If less than 100 messages were fetched, stop the loop
        if (messages.size < fetchLimit) break;
      }

      // Bulk delete the filtered messages
      await message.channel.bulkDelete(messagesToDelete, true);

      const purgeMessageEmbed = successEmbed(
        `Purged ${messagesToDelete.size} messages.`
      );
      await message.author.send({
        embeds: [purgeMessageEmbed]
      });
    } catch (error) {
      console.error("Error purging messages:", error);
      const errorPurgeEmbed = errorEmbed(
        "An error occurred while trying to purge messages."
      );
      message.reply({
        embeds: [errorPurgeEmbed]
      });
    }
  }
};

module.exports = purgeCommand;
