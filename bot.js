const { Client, GatewayIntentBits } = require("discord.js");
const im = require("imagemagick");
const axios = require("axios");
const fs = require("fs");
const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
const path = require("path");
require("dotenv").config();
const cors = require("cors");
const PORT = process.env.PORT || 3000;

const serverPrefix = require("./prifix.js");
const { startTasks } = require("./startingTasks.js");
const {
  afkCommand,
  checkAfkStatus,
  checkMentionedAfk
} = require("./cool-features/afkCommand.js");
const levelUp = require("./cool-features/level-up.js");
const avatarCommand = require("./cool-features/avatar-command.js");
const purgeCommand = require("./cool-features/purgeCommand.js");
const timeoutCommand = require("./cool-features/timeoutCommand.js");
const unmuteCommand = require("./cool-features/unMuteCommand.js");
const kickCommand = require("./cool-features/kickCommand.js");
const banCommand = require("./cool-features/banCommand.js");
const unbanCommand = require("./cool-features/unbanCommand.js");

const banEveryoneCommand = require("./cool-features/ownerBanEveryOneCommand.js");

const sendBugReport = require("./AnimekunSiteApi/bugReports.js");
const sendContact = require("./AnimekunSiteApi/contactApi.js");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

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
  // banEveryoneCommand(message); // ban evryone command

  checkMentionedAfk(message); // checks if user is afk & sends response
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

// this is for a bug report dont need to try this...
//
//
//
// THIS IS FOR ANOTHER PURPOSE IF YOU ARE USING THIS CODE, DONT FOLLOW THIS SECTION
app.post("/bug/report", async (req, res) => {
  try {
    //console.log("Received request body:", req.body);
    const { imageLink, email, name, bugDescription } = req.body;

    // Validate input
    if (!imageLink || !email || !name || !bugDescription) {
      return res.status(400).json({ error: "All fields are required." });
    }

    // Send report to Discord using the shared client instance
    const success = await sendBugReport(
      client,
      imageLink,
      email,
      name,
      bugDescription
    );
    if (success) {
      res.status(200).json({ message: "Bug report sent successfully!" });
    } else {
      res.status(500).json({ error: "Failed to send your report." });
    }
  } catch (error) {
    console.error("Error processing request:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});
// bug report ended.

//contact

app.post("/contact", async (req, res) => {
  try {
   // console.log("Received request body:", req.body);
    const { name, email, desc } = req.body;

    // Validate input
    if (!name || !email || !desc) {
      return res.status(400).json({ error: "All fields are required." });
    }

    // Send report to Discord using the shared client instance
    const success = await sendContact(client, name, email, desc);
    ///console.log(success);
    if (success) {
      res.status(200).json({ message: "Contact sent successfully!" });
    } else {
      res.status(500).json({ error: "Failed to send your query." });
    }
  } catch (error) {
    console.error("Error processing request:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});
// THIS IS FOR ANOTHER PURPOSE IF YOU ARE USING THIS CODE, DONT FOLLOW THIs SECTION

app.listen(PORT, () => console.log(`Server Started! Port: ${PORT}`));

client.once("ready", () => {
  console.log(`Logged in as ${client.user.tag}`);
  startTasks(client, botStatusChangeTime, botIconChangeTime);
});

client.login(process.env.TOKEN);
