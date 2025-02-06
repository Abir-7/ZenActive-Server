import fs from "fs";
import path from "path";

const unlinkFile = (file: string) => {
  const filePath = path.join("uploads", file);
  console.log("sdsds1");
  if (fs.existsSync(filePath)) {
    console.log("sdsds2");
    fs.unlinkSync(filePath);
  }
};

export default unlinkFile;
