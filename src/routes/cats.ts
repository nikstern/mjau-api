import express from "express";
import controller from "../controllers/cats";
import multer from "multer";
const upload = multer();
const router = express.Router();

router.post("/cat/:name", controller.uploadImg, controller.addCat);

export = router;
