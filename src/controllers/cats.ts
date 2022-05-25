import { Request, Response, NextFunction } from "express";
import { Cat } from "../models/cats";
import multer from "multer";
import path from "path";
const helpers = require("../helpers/helpers");
const map = new Map<string, Cat>();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const uploadImg = multer({
  storage: storage,
  fileFilter: helpers.imageFilter,
}).single("file");

const addCat = (req: any, res: Response, next: NextFunction) => {
  const name = req.body.name;
  const path = req.file?.path;
  if (!name || !path) {
    res.statusCode = 400;
    let message: string;
    if (!name && !path) {
      message = "Invalid Name and Path";
    } else if (!name) {
      message = "Invalid Name";
    } else {
      message = "Invalid Path";
    }
    return res.json(message);
  }
  if (!map.has(name)) {
    const newCat = {
      name,
      path,
    };
    map.set(name, newCat);
    // Created
    res.statusCode = 201;
    return res.json(req.params);
  } else {
    // Conflict
    res.statusCode = 400;
    return res.json("We've got this Cat");
  }
};

export default { addCat, map, uploadImg };
