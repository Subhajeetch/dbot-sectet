const { ActivityType } = require('discord.js');
const fs = require('fs');

const icons = [
  "images/snow_animekun.gif",
  "images/picture2.jpg",
  "images/picture3.jpg",
  "images/picture4.jpg",
  "images/picture5.jpg",
  "images/picture6.jpg",
  "images/picture7.jpg",
  "images/picture8.jpg",
  "images/picture9.jpg"
]; //USE YOUR OWN PICTURES

const avatars = [
  "images/snow_animekun.gif",
  "images/picture2.jpg",
  "images/picture3.jpg",
  "images/picture4.jpg",
  "images/picture5.jpg",
  "images/picture6.jpg",
  "images/picture7.jpg",
  "images/picture8.jpg",
  "images/picture9.jpg"
]; //USE YOUR OWN PICTURES

const statuses = [
  { name: "You Pooping", type: ActivityType.Watching },
  { name: "your Nonsense", type: ActivityType.Listening },
  { name: "with your Heart", type: ActivityType.Playing },
  { name: "Animekun.lol", type: ActivityType.Watching },
  { name: "your excuses", type: ActivityType.Listening },
  { name: "you pretend to work", type: ActivityType.Watching },
  { name: "nice... for now!", type: ActivityType.Playing },
  { name: "you struggle", type: ActivityType.Watching },
  { name: "dumb", type: ActivityType.Playing },
  { name: "you panic", type: ActivityType.Watching },
  { name: "it cool", type: ActivityType.Playing },
  { name: "your mess", type: ActivityType.Watching },
  { name: "along", type: ActivityType.Playing },
  { name: "your every move", type: ActivityType.Watching },
  { name: "hide and seek", type: ActivityType.Playing },
  { name: "the world burn", type: ActivityType.Watching },
  { name: "your problems", type: ActivityType.Listening },
  { name: "your every mistake", type: ActivityType.Watching },
  { name: "with your mind", type: ActivityType.Playing },
  { name: "your problems", type: ActivityType.Listening },
  { name: "nice with everyone", type: ActivityType.Playing },
  { name: "you fail again", type: ActivityType.Watching },
  { name: "endless drama", type: ActivityType.Listening },
  { name: "with broken hearts", type: ActivityType.Playing },
  { name: "you overthink everything", type: ActivityType.Watching },
  { name: "endless excuses", type: ActivityType.Listening },
  { name: "on borrowed time", type: ActivityType.Playing },
  { name: "you complain", type: ActivityType.Listening },
  { name: "you lose control", type: ActivityType.Watching },
  { name: "bad advice", type: ActivityType.Listening },
  { name: "tricks on you", type: ActivityType.Playing },
  { name: "your bold moves", type: ActivityType.Watching },
  { name: "daily drama", type: ActivityType.Listening },
  { name: "you act tough", type: ActivityType.Watching },
  { name: "dumb today", type: ActivityType.Playing },
  { name: "your cringe texts", type: ActivityType.Watching },
  { name: "with fire", type: ActivityType.Playing }
]; //ADD ACORDING TO YOU


const botIconChangeTime = 5; //number (in minutes)
const botStatusChangeTime = 1; //number (in minutes)

let currentAvatarIndex = 0;
let currentStatusIndex = 0;

// Function to change the bot avatar
async function changeBotAvatar(client) {
  try {
    const avatarPath = avatars[currentAvatarIndex];
    await client.user.setAvatar(fs.readFileSync(avatarPath));
    currentAvatarIndex = (currentAvatarIndex + 1) % avatars.length;
  } catch (error) {
    console.error('Failed to change bot avatar:', error);
  }
}

// Function to change the bot status
function changeStatus(client) {
  try {
    const status = statuses[currentStatusIndex];
    client.user.setActivity(status.name, { type: status.type });
    currentStatusIndex = (currentStatusIndex + 1) % statuses.length;
  } catch (error) {
    console.error('Failed to change bot status:', error);
  }
}

// Function to start periodic tasks
function startTasks(client, botStatusChangeTime, botIconChangeTime) {
  setInterval(() => changeBotAvatar(client), botIconChangeTime * 60 * 1000);
  setInterval(() => changeStatus(client), botStatusChangeTime * 60 * 1000);
}

module.exports = { changeBotAvatar, changeStatus, startTasks };