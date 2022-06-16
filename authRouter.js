import { Router } from "express";
import controller from "./authController";
import { check } from "express-validator";
import authMiddleware from "./middlewares/authMiddleware";
import roleMiddleware from "./middlewares/roleMiddleware";

const router = new Router();

router.post(
  "/registration",
  [
    check("username", "Username is required").notEmpty(),
    check(
      "password",
      "Password should be more than 4 and less than 24 characters"
    ).isLength({ min: 4, max: 24 }),
  ],
  controller.registration
);
router.post("/login", controller.login);
router.get(
  "/users",
  [authMiddleware, roleMiddleware(["ADMIN"])],
  controller.getUsers
);

export default router;
