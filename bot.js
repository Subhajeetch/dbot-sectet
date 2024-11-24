const { Client, GatewayIntentBits } = require("discord.js");
const im = require("imagemagick");
const axios = require("axios");
const fs = require("fs");
const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
const path = require("path");
require("dotenv").config();
const PORT = process.env.PORT || 3000;

const serverPrefix = require("./prifix.js");
const { startTasks } = require("./startingTasks.js");
const { afkCommand, checkAfkStatus } = require("./cool-features/afkCommand.js");
const levelUp = require("./cool-features/level-up.js");
const avatarCommand = require("./cool-features/avatar-command.js");
const purgeCommand = require("./cool-features/purgeCommand.js");
const timeoutCommand = require("./cool-features/timeoutCommand.js");
const unmuteCommand = require("./cool-features/unMuteCommand.js");
const kickCommand = require("./cool-features/kickCommand.js");
const banCommand = require("./cool-features/banCommand.js");
const unbanCommand = require("./cool-features/unbanCommand.js");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.DirectMessages
  ]
});

const botIconChangeTime = 8; //number (in minutes)
const botStatusChangeTime = 1; //number (in minutes)

client.on("messageCreate", async message => {
  if (message.author.bot) return; // Ignore messages from bots

  levelUp(message); //levelUp card
  avatarCommand(message); // avatar command
  purgeCommand(message); // purge command
  timeoutCommand(message); // mute command
  unmuteCommand(message); // ummute command
  kickCommand(message); // kick command
  banCommand(message); //ban command
  unbanCommand(message); // unban command

  await checkAfkStatus(message); // afk status

  // Handle AFK command
  if (message.content.startsWith(`${serverPrefix}afk`)) {
    await afkCommand(message);
  }

  if (message.content === `${serverPrefix}ping`) {
    const ping = Date.now() - message.createdTimestamp;
    const apiPing = Math.round(client.ws.ping);
    await message.reply(
      `Pong! 🏓\nServer Latency: ${ping}ms\nAPI Latency: ${apiPing}ms`
    );
  }
});

app.get("/", (req, res) => {
  res.send(`
        <h1>Bot Alive!!! - MANTO999</h1>
    `);
});

app.listen(PORT, () => console.log(`Server Started! Port: ${PORT}`));

client.once("ready", () => {
  console.log(`Logged in as ${client.user.tag}`);
  startTasks(client, botStatusChangeTime, botIconChangeTime);
});

client.login(process.env.TOKEN);
