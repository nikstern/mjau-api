import express from "express";
import controller from "../controllers/cats";
import multer from "multer";
import { fileStorage, fileFilter } from "../storage";
const uploadImg = multer({
  storage: fileStorage,
  fileFilter: fileFilter,
}).single("image");

const router = express.Router();

router.post("/cats/:name", uploadImg, controller.addCat);
router.get("/cats/:name", controller.getCat);
router.get("/cats", controller.getCats);
router.put("/cats/:name", uploadImg, controller.updateCat);
router.delete("/cats/:name", controller.deleteCat);

export = router;
