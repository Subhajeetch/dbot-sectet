const { errorEmbed, successEmbed } = require("../utils/embeds.js");
const serverPrefix = require("../prifix.js");
const { PermissionFlagsBits, EmbedBuilder } = require("discord.js");

const timeoutCommand = async message => {
  if (
    message.content.startsWith(`${serverPrefix}m`) ||
    message.content.startsWith(`${serverPrefix}mute`)
  ) {
    try {
      // Check if the user has permission to timeout members
      if (
        !message.member.permissions.has(PermissionFlagsBits.ModerateMembers)
      ) {
        const noPermEmbed = errorEmbed(
          "You don't have permissions bro."
        );
        return message.reply({ embeds: [noPermEmbed] });
      }

      const args = message.content
        .slice(
          serverPrefix.length +
            (message.content.startsWith(`${serverPrefix}mute`) ? 5 : 1)
        )
        .trim()
        .split(/ +/g);
      const mentionedUser = message.mentions.members.first();

      // Function to send the mute guide embed
      const sendMuteGuide = () => {
        const muteGuideEmbed = new EmbedBuilder()
          .setTitle("🔇 Mute Guide")
          .setColor(0x54ff32)
          .setDescription(
            `**Usage:**\n${serverPrefix}mute @user [duration] [reason]\n${serverPrefix}m @user [duration] [reason]\n\n**Examples:**\n${serverPrefix}m @user\n${serverPrefix}mute @user 30s Spamming\n${serverPrefix}m @user 1h Inappropriate behavior\n\n**Duration format:**\ns or S - seconds\nm or M - minutes\nh or H - hours\nd or D - days\n\nDefault duration is 1 hour if not specified.\nMinimum duration: 10 seconds\nMaximum duration: 14 days`
          )
          .setFooter({ text: "Mention a user to mute them." });
        return message.reply({ embeds: [muteGuideEmbed] });
      };

      // Check for invalid input formats (e.g., missing spaces)
      const commandRegex = new RegExp(
        `^${serverPrefix}(mute|m)\\s+<@!?(\\d+)>\\s*(\\d+[smhd])?\\s*(.*)?$`
      );
      if (!commandRegex.test(message.content)) {
        return sendMuteGuide();
      }

      // If no user is mentioned, send the guide
      if (!mentionedUser) {
        return sendMuteGuide();
      }

      // Check if the user is already muted
      if (mentionedUser.isCommunicationDisabled()) {
        const alreadyMutedEmbed = errorEmbed("This user is already muted.");
        return message.reply({ embeds: [alreadyMutedEmbed] });
      }

      // Check if the bot can timeout the user
      if (!mentionedUser.moderatable) {
        const cantMuteEmbed = new EmbedBuilder()
          .setTitle("<:cross:1310179339005988945>  Unsuccessful")
          .setColor(0xff0320)
          .setDescription(`User is immune, can't be muted.`);
        return message.reply({ embeds: [cantMuteEmbed] });
      }

      // Parse duration and reason
      let duration = 300000; // Default 1 hour in milliseconds
      let reason = "No reason provided";

      if (args.length >= 2) {
        const timeArg = args[1].toLowerCase();
        const timeMatch = timeArg.match(/^(\d+)([smhd])$/i);
        if (timeMatch) {
          const [, time, unit] = timeMatch;
          switch (unit.toLowerCase()) {
            case "s":
              duration = parseInt(time) * 1000;
              break;
            case "m":
              duration = parseInt(time) * 60000;
              break;
            case "h":
              duration = parseInt(time) * 3600000;
              break;
            case "d":
              duration = parseInt(time) * 86400000;
              break;
            default:
              return sendMuteGuide();
          }
          reason = args.slice(2).join(" ") || reason;
        } else {
          // If the format is invalid, send the guide
          return sendMuteGuide();
        }
      }

      // Check if duration is within allowed range (10 seconds to 14 days)
      if (duration < 10000 || duration > 1209600000) {
        const invalidDurationEmbed = errorEmbed(
          "Invalid duration. Duration must be between 10 seconds and 14 days."
        );
        return message.reply({ embeds: [invalidDurationEmbed] });
      }

      // Timeout the user
      await mentionedUser.timeout(duration, reason);

      // Calculate human-readable duration
      let readableDuration;
      if (duration < 60000) {
        readableDuration = `${Math.floor(duration / 1000)} second(s)`;
      } else if (duration < 3600000) {
        readableDuration = `${Math.floor(duration / 60000)} minute(s)`;
      } else if (duration < 86400000) {
        readableDuration = `${Math.floor(duration / 3600000)} hour(s)`;
      } else {
        readableDuration = `${Math.floor(duration / 86400000)} day(s)`;
      }

      // Send success embed
      const successMuteEmbed = new EmbedBuilder()
        .setTitle("<:tick:1310179325152067676>  Success")
        .setColor(0x54ff32)
        .setDescription(
          `**Successfully muted  <@${mentionedUser.user.id}>.**\n\nDuration: ${readableDuration}.\nReason: ${reason}.`
        );
      await message.reply({ embeds: [successMuteEmbed] });
    } catch (error) {
      console.error("Error in timeout command:", error);
      const errorMuteEmbed = errorEmbed(
        "An error occurred while trying to mute the user."
      );
      await message.reply({ embeds: [errorMuteEmbed] });
    }
  }
};

module.exports = timeoutCommand;
