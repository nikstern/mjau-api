import express from "express";
import controller from "../controllers/cats";
import multer from "multer";
const upload = multer();
const router = express.Router();

router.post("/cat/:name", controller.uploadImg, controller.addCat);
router.get("/cat/:name", controller.getCat);
router.get("/cat", controller.getCats);
router.put("/cat/:name", controller.uploadImg, controller.updateCat);
router.delete("/cat/:name", controller.deleteCat);
export = router;
