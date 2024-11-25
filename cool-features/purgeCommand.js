const { errorEmbed, successEmbed } = require("../utils/embeds.js");
const serverPrefix = require("../prifix.js");
const { PermissionFlagsBits, EmbedBuilder } = require("discord.js");

const purgeCommand = async message => {
  if (
    message.content.startsWith(`${serverPrefix}p`) ||
    message.content.startsWith(`${serverPrefix}purge`)
  ) {
    // Check if the user has "Manage Messages" permission
    if (!message.member.permissions.has(PermissionFlagsBits.ManageMessages)) {
      const noPermEmbed = errorEmbed("You don't have permissions bro.");
      return message.reply({ embeds: [noPermEmbed] });
    }
    try {
      // Extract command arguments dynamically based on prefix length
      const commandLength = message.content.startsWith(`${serverPrefix}purge`)
        ? serverPrefix.length + 5 // Adjust for "purge"
        : serverPrefix.length + 1; // Adjust for "p"

      const args = message.content.slice(commandLength).trim().split(/ +/g);

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
      if (args[1] && args[1].match(/^<@!?\d+>$/)) {
        targetUser = message.mentions.users.first();
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

      // Send a confirmation message in the channel
      const successEmbedMessage = successEmbed(
        `Successfully purged ${totalMessagesDeleted} messages.`
      );
      await message.channel
        .send({ embeds: [successEmbedMessage] })
        .then(msg => setTimeout(() => msg.delete(), 5000)); // Delete confirmation after 5s
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