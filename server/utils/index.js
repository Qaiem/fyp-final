// import jwt from "jsonwebtoken";

// const createJWT = (res, userId) => {
//   const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
//     expiresIn: "1d",
//   });

//   res.cookie("token", token, {
//     httpOnly: true,
//     secure: process.env.NODE_ENV !== "development", // Use secure cookies in production
//     sameSite: "Strict", // Prevent CSRF attacks
//     maxAge: 1 * 24 * 60 * 60 * 1000, // 1 days
//   });
// };

// export default createJWT;

// Inside utils/index.js
import jwt from "jsonwebtoken";

const createJWT = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  // ... existing cookie logic ...
  res.cookie("token", token, {
     httpOnly: true,
     // ... other options
  });

  return token; // 👈 ADD THIS LINE! Important!
};

export default createJWT;