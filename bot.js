const { Client, GatewayIntentBits } = require("discord.js");
const im = require("imagemagick");
const axios = require("axios");
const fs = require("fs");
const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
const path = require("path");

const levelUp = require("./cool-features/level-up.js");
const avatarCommand = require("./cool-features/avatar-command.js");
const serverPrifix = require("./prifix.js");
const { startTasks } = require("./startingTasks.js");

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

const botIconChangeTime = 1; //number (in minutes)
const botStatusChangeTime = 1; //number (in minutes)

client.on("messageCreate", async message => {
  if (message.author.bot) return; // Ignore messages from bots

  levelUp(message); //levelUp card
  avatarCommand(message);

  if (message.content === `${serverPrifix}ping`) {
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

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});

client.once("ready", () => {
  console.log(`Logged in as ${client.user.tag}`);
  startTasks(client, botStatusChangeTime, botIconChangeTime);
});

client.login(
  "MTI5NTcyMDg5NjIyNDU2MzI3MQ.GO7JaI.cYt2jGSTPMY8VOaEqwfDAOJxPgaafCUGd5SJRM"
);
