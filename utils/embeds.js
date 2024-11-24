const { EmbedBuilder } = require("discord.js");

function errorEmbed(errorMessage) {
  return new EmbedBuilder()
    .setColor(0xc00034) // Red for error
    .setDescription(`<:cross:1310179339005988945>  **${errorMessage}**`);
}

function successEmbed(successMessage) {
  return new EmbedBuilder()
    .setColor(0x54ff32) // Green for success
    .setDescription(`<:tick:1310179325152067676>  **${successMessage}**`);
}

function avatarEmbed(avatarUrl) {
  return new EmbedBuilder().setColor(0xf523d2).setImage(avatarUrl);
}

module.exports = { errorEmbed, successEmbed, avatarEmbed };
