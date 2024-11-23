const searchUser = async (guild, searchTerm) => {
  if (!guild) return null;

  // Fetch all members in the guild
  const members = await guild.members.fetch();

  // Search for a user by nickname or username or display name (if no nickname)
  const user = members.find(member => {
    const username = member.user.username.toLowerCase(); // Username outside of the server
    const nickname = member.nickname ? member.nickname.toLowerCase() : null; // Server-specific nickname
    const displayName = member.user.tag.toLowerCase(); // Display name (username#discriminator)

    return (
      username.includes(searchTerm.toLowerCase()) ||
      (nickname && nickname.includes(searchTerm.toLowerCase())) ||
      displayName.includes(searchTerm.toLowerCase())
    );
  });

  return user || null; // Return null if no user is found
};

module.exports = searchUser;