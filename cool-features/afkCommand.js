const fs = require("fs");
const path = require("path");
const { EmbedBuilder } = require("discord.js");
const { errorEmbed, successEmbed } = require("../utils/embeds.js");
const serverPrefix = require("../prifix.js");

const usersAFKPath = path.resolve(__dirname, "../usersAFK.json");

// Function to handle AFK command
const afkCommand = async message => {
  if (message.content.startsWith(`${serverPrefix}afk`)) {
    try {
      const args = message.content
        .slice(serverPrefix.length + 3)
        .trim()
        .split(" ");
      const reason = args.join(" ") || "none";

      // Load AFK data
      let afkData = {};
      if (fs.existsSync(usersAFKPath)) {
        const data = fs.readFileSync(usersAFKPath, "utf-8");
        try {
          afkData = JSON.parse(data);
        } catch (err) {
          console.error("Error parsing AFK data:", err);
        }
      }

      const userId = message.author.id;

      // If the user is already AFK, respond with a message
      if (afkData[userId]) {
        const alreadyAfkEmbed = errorEmbed("You are already in AFK bro.");
        return message.reply({ embeds: [alreadyAfkEmbed] });
      }

      // Mark the user as AFK
      const afkTimestamp = Date.now();
      afkData[userId] = { timestamp: afkTimestamp, reason };

      fs.writeFileSync(usersAFKPath, JSON.stringify(afkData, null, 2), "utf-8");

      // Send confirmation
      const afkSetEmbed = new EmbedBuilder()
        .setColor(0x01d0ff)
        .setDescription(`AFK set. Reason: **${reason}**`);

      return message.reply({ embeds: [afkSetEmbed] });
    } catch (error) {
      console.error("Error in AFK command:", error);
      const errorAfkEmbed = errorEmbed("An error occurred while setting AFK.");
      return message.reply({ embeds: [errorAfkEmbed] });
    }
  }
};

// Function to check and handle AFK removal
const checkAfkStatus = async message => {
  try {
    // Load AFK data
    let afkData = {};
    if (fs.existsSync(usersAFKPath)) {
      const data = fs.readFileSync(usersAFKPath, "utf-8");
      try {
        afkData = JSON.parse(data);
      } catch (err) {
        console.error("Error parsing AFK data:", err);
      }
    }

    const userId = message.author.id;

    // If the user is not AFK, do nothing
    if (!afkData[userId]) return;

    const afkTimestamp = afkData[userId].timestamp;

    // Change from 30 seconds to 1 minute (60000 ms)
    if (Date.now() - afkTimestamp <= 60000) {
      return;
    }

    // If the user messaged after 1 minute, calculate the AFK duration
    const durationMs = Date.now() - afkTimestamp;
    const duration = formatDuration(durationMs);

    // Remove the user from AFK
    delete afkData[userId];
    fs.writeFileSync(usersAFKPath, JSON.stringify(afkData, null, 2), "utf-8");

    // Send AFK removed confirmation
    const afkRemovedEmbed = new EmbedBuilder()
      .setColor(0x01d0ff)
      .setDescription(
        `**Welcome Back! ** You were AFK since ${duration}.`
      );

    await message.reply({ embeds: [afkRemovedEmbed] });
  } catch (error) {
    console.error("Error in checking AFK status:", error);
  }
};

// Helper function to format duration into human-readable format
const formatDuration = ms => {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  const dayString = days > 0 ? `${days} day(s) ` : "";
  const hourString = hours % 24 > 0 ? `${hours % 24} hour(s) ` : "";
  const minuteString = minutes % 60 > 0 ? `${minutes % 60} minute(s)` : "";

  return `${dayString}${hourString}${minuteString}`.trim();
};

module.exports = { afkCommand, checkAfkStatus };
