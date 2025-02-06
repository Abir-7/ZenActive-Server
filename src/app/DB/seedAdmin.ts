import { config } from "../config";
import User_Role from "../modules/user/user.constant";
import { User } from "../modules/user/user.model";

const superUser = {
  name: "Tiffany",
  role: User_Role.ADMIN,
  email: config.admin.email,
  password: config.admin.password,
  isProfileUpdated: true,
  isVerified: true,
  image:
    "https://img.freepik.com/free-vector/business-user-cog_78370-7040.jpg?semt=ais_hybrid",
  verified: true,
};
const seedAdmin = async () => {
  const isExistSuperAdmin = await User.findOne({
    role: User_Role.ADMIN,
  });

  if (!isExistSuperAdmin) {
    await User.create(superUser);
    console.log("admin created.");
  }
};

export default seedAdmin;
