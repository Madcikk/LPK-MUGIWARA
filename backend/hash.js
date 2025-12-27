import bcrypt from "bcryptjs";

bcrypt.hash("admin", 10).then(hash => {
  console.log("Hash:", hash);
});
