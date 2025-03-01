import aws from "aws-sdk";
import { config } from "../../config";

const s3 = new aws.S3({
  accessKeyId: config.aws.aws_access_key,
  secretAccessKey: config.aws.aws_secret_access_key,
  region: config.aws.aws_region,
});

export default s3;
