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
        const alreadyAfkEmbed = errorEmbed("You are already AFK bro.");
        const reply = await message.reply({ embeds: [alreadyAfkEmbed] });

      // Delete the reply after 10 seconds
      setTimeout(() => {
        reply.delete().catch(console.error); // Ensure deletion errors are logged
      }, 10000); // 10,000 ms = 10 seconds
      return;
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

    // Create a Discord timestamp format for relative time
    const relativeTime = `<t:${Math.floor(afkTimestamp / 1000)}:R>`;

    // Remove the user from AFK
    delete afkData[userId];
    fs.writeFileSync(usersAFKPath, JSON.stringify(afkData, null, 2), "utf-8");

    // Send AFK removed confirmation
    const afkRemovedEmbed = new EmbedBuilder()
      .setColor(0x01d0ff)
      .setDescription(`**Welcome Back! ** You were AFK since ${relativeTime}.`);

    const reply = await message.reply({ embeds: [afkRemovedEmbed] });
    
    setTimeout(() => {
        reply.delete().catch(console.error); // Ensure deletion errors are logged
      }, 10000); // 10,000 ms = 10 seconds
      return;
  } catch (error) {
    console.error("Error in checking AFK status:", error);
  }
};



const checkMentionedAfk = message => {
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

    // Loop through all mentioned users
    message.mentions.users.forEach(user => {
      const userId = user.id;

      // Check if the mentioned user is AFK
      if (afkData[userId]) {
        const afkTimestamp = afkData[userId].timestamp;
        const reason = afkData[userId].reason || "No reason provided";

        // Create a Discord timestamp format for relative time
        const relativeTime = `<t:${Math.floor(afkTimestamp / 1000)}:R>`;

        // Send the AFK response
        message.channel.send(
          `${user.username} is AFK since ${relativeTime} for reason: ${reason}`
        );
      }
    });
  } catch (error) {
    console.error("Error in checking mentioned AFK:", error);
  }
};

module.exports = { afkCommand, checkAfkStatus, checkMentionedAfk };
