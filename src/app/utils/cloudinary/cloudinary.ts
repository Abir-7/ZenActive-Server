import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import { config } from "../../config";
import fs from "fs";

cloudinary.config({
  cloud_name: config.cloudinary.cloud_name,
  api_key: config.cloudinary.api_key,
  api_secret: config.cloudinary.api_secret,
});

export const uploadToCloudinary = async (
  filePath: string,
  folder: string,
  resourceType: "image" | "video" | "auto" = "auto"
): Promise<UploadApiResponse> => {
  return new Promise((resolve, reject) => {
    const stats = fs.statSync(filePath);
    const fileSizeInBytes = stats.size;
    const fileSizeInMB = fileSizeInBytes / (1024 * 1024);

    const options: any = {
      folder: folder,
      resource_type: resourceType,
      use_filename: true,
      unique_filename: true,
      overwrite: false,
    };

    if (resourceType === "video") {
      // For videos, add some default transformations but keep them async
      options.eager = [
        { width: 1280, height: 720, crop: "limit", quality: "auto", fetch_format: "auto" }
      ];
      options.eager_async = true;

      if (fileSizeInMB > 10) {
        // Use upload_large for videos larger than 10MB
        cloudinary.uploader.upload_large(filePath, options, (error, result) => {
          if (error) reject(error);
          else resolve(result as UploadApiResponse);
        });
      } else {
        // Standard upload for smaller videos
        cloudinary.uploader.upload(filePath, options, (error, result) => {
          if (error) reject(error);
          else resolve(result as UploadApiResponse);
        });
      }
    } else {
      // For images, we can also optimize
      if (resourceType === "image") {
        options.transformation = [
          { quality: "auto", fetch_format: "auto" }
        ];
      }
      
      cloudinary.uploader.upload(filePath, options, (error, result) => {
        if (error) reject(error);
        else resolve(result as UploadApiResponse);
      });
    }
  });
};

export const deleteFromCloudinary = async (
  publicId: string,
  resourceType: "image" | "video" = "image"
) => {
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
  } catch (error) {
    console.error(`Failed to delete ${publicId} from Cloudinary:`, error);
  }
};

export const generateCloudinarySignature = (folder: string) => {
  const timestamp = Math.round(new Date().getTime() / 1000);
  
  // The signature must include all parameters sent in the upload request
  // except for 'file', 'api_key', 'callback', 'signature', 'resource_type', 
  // and 'type' (in some cases).
  const paramsToSign = {
    timestamp: timestamp,
    folder: folder,
  };
  
  const signature = cloudinary.utils.api_sign_request(
    paramsToSign,
    config.cloudinary.api_secret!
  );

  return {
    timestamp,
    signature,
    cloudName: config.cloudinary.cloud_name,
    apiKey: config.cloudinary.api_key,
    folder: folder
  };
};

export const cloudinaryInstance = cloudinary;
