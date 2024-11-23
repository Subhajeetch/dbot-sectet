const im = require("imagemagick");
const fs = require("fs");
const path = require("path");

const generateLoveImage = (user1AvatarPath, user2AvatarPath, outputPath, callback) => {
  // Define the dimensions for the canvas
  const canvasWidth = 1024;
  const canvasHeight = 512;

  // Define the size and position for user avatars
  const avatarSize = 530; // You can adjust this to your needs
  const user1X = -5; // Position for user1's avatar (left side)
  const user1Y = (canvasHeight - avatarSize) / 2; 
  // Center vertically
  const user2X = canvasWidth - avatarSize - -5; // Position for user2's avatar (right side)
  const user2Y = (canvasHeight - avatarSize) / 2; 
  // Center vertically

  // Generate the image with user1 and user2 avatars
  im.convert(
    [
      // Set the canvas size to match the love image dimensions
      "-size", `${canvasWidth}x${canvasHeight}`, "xc:white", // White background to start with

      // User 1 Avatar (left side)
      "-draw", `image over ${user1X},${user1Y} ${avatarSize},${avatarSize} '${user1AvatarPath}'`, // Position and scale user1's avatar

      // User 2 Avatar (right side)
      "-draw", `image over ${user2X},${user2Y} ${avatarSize},${avatarSize} '${user2AvatarPath}'`, // Position and scale user2's avatar

      // Output the result to the specified output path
      outputPath,
    ],
    (err) => {
      if (err) {
        console.error('Error generating the image:', err);
        callback(err);
        return;
      }
      callback(null); // No errors, image generated successfully
    }
  );
};

module.exports = generateLoveImage;