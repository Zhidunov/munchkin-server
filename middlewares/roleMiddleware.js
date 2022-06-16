import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../config";

export default function (roles) {
  return function (req, res, next) {
    if (req.method === "OPTIONS") {
      next();
    }

    try {
      const token = req.headers?.authorization?.split(" ")?.[1];
      if (!token) {
        return res.status(403).json({ message: "User is not authorized" });
      }
      const { roles: userRoles } = jwt.verify(token, SECRET_KEY);
      let hasRole = false;
      userRoles.forEach((role) => {
        if (roles.includes(role)) {
          hasRole = true;
        }
      });
      if (!hasRole) {
        return res.status(403).json({ message: "User does not have access" });
      }
      next();
    } catch (err) {
      console.log(err);
      return res.status(403).json({ message: "User is not authorized" });
    }
  };
}
