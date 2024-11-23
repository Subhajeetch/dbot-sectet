const { EmbedBuilder } = require("discord.js");

function errorEmbed(errorMessage) {
  return new EmbedBuilder()
    .setColor(0xc00034) // Red for error
    .setDescription(errorMessage);
}

function successEmbed(successMessage) {
  return new EmbedBuilder()
    .setColor(0x54ff32) // Green for success
    .setDescription(successMessage);
}

function avatarEmbed(avatarUrl) {
  return new EmbedBuilder()
  .setColor(0xf523d2)
  .setImage(avatarUrl);
}

module.exports = { errorEmbed, successEmbed, avatarEmbed };