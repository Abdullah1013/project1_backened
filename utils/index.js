const jwt = require("jsonwebtoken");
require("dotenv").config();
const HASH_SALT = process.env.HASH_SALT;
module.exports = {
    JWT: {
      generateToken: async (user) => {
        return jwt
          .sign(
            {
              email: user.email,
            },
            HASH_SALT,
            {
              expiresIn: "24h",
            }
          )
          .toString();
      },
    },
  };
  