export const extractPublicId = (videoUrl: string) => {
  const urlParts = videoUrl.split("/");
  const filenameWithExtension = urlParts[urlParts.length - 1]; // "video123.mp4"
  const filenameWithoutExtension = filenameWithExtension.split(".")[0];

  // Extract folder path if available
  const folderPath = urlParts.slice(-2, -1)[0]; // Assumes structure like 'https://res.cloudinary.com/.../videos/video123.mp4'

  return folderPath
    ? `${folderPath}/${filenameWithoutExtension}`
    : filenameWithoutExtension;
};
