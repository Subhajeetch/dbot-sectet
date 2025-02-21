const { EmbedBuilder } = require("discord.js");

const BugReportChennel = "1341851802089558107";

const sendBugReport = async (
  client,
  imageLink,
  email,
  name,
  bugDescription
) => {
  try {
    const channel = await client.channels.fetch(BugReportChennel);
    if (!channel) {
      console.error("Channel not found.");
      return false;
    }

    const embed = new EmbedBuilder()
      .setTitle("🐞 Bug Report")
      .setColor("#ff0000")
      .setDescription(`**Name:** ${name}\n**Email:** ${email}`)
      .addFields({ name: "Description", value: bugDescription })
      .setImage(imageLink)
      .setTimestamp();

    await channel.send({ embeds: [embed] });
    return true;
  } catch (error) {
    console.error("Error sending message to Discord:", error);
    return false;
  }
};

module.exports = sendBugReport;
