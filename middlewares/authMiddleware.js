import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../config";

export default function (req, res, next) {
  if (req.method === "OPTIONS") {
    next();
  }

  try {
    const token = req.headers?.authorization?.split(" ")?.[1];
    if (!token) {
      return res.status(403).json({ message: "User is not authorized" });
    }
    const decodedData = jwt.verify(token, SECRET_KEY);
    req.user = decodedData;
    next();
  } catch (err) {
    console.log(err);
    return res.status(403).json({ message: "User is not authorized" });
  }
}
