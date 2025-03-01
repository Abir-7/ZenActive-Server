import fs from "fs-extra";
import s3 from "./s3";
import { config } from "../../config";
import unlinkFile from "../unlinkFiles";
import AppError from "../../errors/AppError";

/**
 * Uploads a file to AWS S3 and deletes it locally after upload or failure.
 * @param filePath - Local file path
 * @param fileName - Name to be stored in S3
 * @returns S3 file URL or null on failure
 */
export const uploadFileToS3 = async (
  filePath: string,
  fileName: string
): Promise<string | null> => {
  try {
    const fileContent = await fs.readFile(filePath);

    const params = {
      Bucket: config.aws.aws_bucket_name as string,
      Key: `${fileName}`, // Adjust S3 storage path
      Body: fileContent,
      ContentType: "video/mp4",
      ACL: "public-read", // Change this based on security needs
    };

    const uploadResult = await s3.upload(params).promise();

    // Delete file after successful upload
    unlinkFile(filePath);

    return uploadResult.Location;
  } catch (error) {
    unlinkFile(filePath);
    return null;
  }
};
