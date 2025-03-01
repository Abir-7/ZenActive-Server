import { cloudinaryInstance } from "./cloudinary";

export const deleteCloudinaryVideo = async (
  publicId: string,
  resource_type: string
) => {
  console.log(publicId, resource_type);
  try {
    const response = await cloudinaryInstance.uploader.destroy(
      publicId.trim(),
      {
        resource_type: resource_type,
        invalidate: true,
      }
    );
    console.log(response);
    if (response.result === "ok") {
      console.log("Video deleted successfully.");
    } else {
      console.error("Failed to delete video.");
    }
  } catch (error) {
    console.error("Error deleting video:", error);
  }
};
