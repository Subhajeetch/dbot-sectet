const { EmbedBuilder } = require("discord.js");

const contactChannel = "1341852040703250522";

const sendContact = async (client, name, email, desc) => {
  try {
    const channel = await client.channels.fetch(contactChannel);
    if (!channel) {
      console.error("Channel not found.");
      return false;
    }

    const embed = new EmbedBuilder()
      .setTitle("**📨 Someone Contacted**")
      .setColor("#00ffa1")
      .setDescription(`**Name:** ${name}\n**Email:** ${email}`)
      .addFields({ name: "Query", value: desc })
      .setTimestamp();

    await channel.send({ embeds: [embed] });
    return true;
  } catch (error) {
    console.error("Error sending message to Discord:", error);
    return false;
  }
};

module.exports = sendContact;
