// getUserByUserName.js
const getUserByUserName = async (guild, username) => {
  try {
    // Try to fetch members with a timeout
    const members = await guild.members.fetch({ timeout: 5000 }); // Timeout set to 5 seconds

    // Find the member by username (case-insensitive)
    const member = members.find(
      (member) => member.user.username.toLowerCase() === username.toLowerCase()
    );

    return member || null;
  } catch (err) {
    console.error("Error fetching members:", err);
    return null; // Return null if unable to fetch members
  }
};

module.exports = getUserByUserName;