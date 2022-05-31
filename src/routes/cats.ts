import express from "express";
import catController from "../controllers/cats";
import userController from "../controllers/users";
import { uploadImg } from "../middleware/storage";
const auth = require("../middleware/auth");

const router = express.Router();
router.post("/register", userController.register);
router.post("/login", userController.login);
router.post("/cats/:name", auth, uploadImg, catController.addCat);
router.get("/cats/:name", auth, catController.getCat);
router.get("/cats", auth, catController.getCats);
router.put("/cats/:name", auth, uploadImg, catController.updateCat);
router.delete("/cats/:name", auth, catController.deleteCat);

export = router;
