import express from "express";
import controller from "../controllers/cats";
import multer from "multer";
const upload = multer();
const router = express.Router();

router.post("/cats/:name", controller.uploadImg, controller.addCat);
router.get("/cats/:name", controller.getCat);
router.get("/cats", controller.getCats);
router.put("/cats/:name", controller.uploadImg, controller.updateCat);
router.delete("/cats/:name", controller.deleteCat);

export = router;
