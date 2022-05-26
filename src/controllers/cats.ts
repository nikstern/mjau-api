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

const getCat = (req: Request, res: Response, next: NextFunction) => {
  const name = req.params.name;
  const cat = map.get(name);
  if (cat) {
    return res.sendFile(path.resolve(cat.path.toString()));
  } else {
    res.statusCode = 404;
    return res.json(`I don't have a cat named ${name}`);
  }
};

const getCats = (req: Request, res: Response, next: NextFunction) => {
  return res.json(Array.from(map.values()));
};

const addCat = (req: Request, res: Response, next: NextFunction) => {
  const name = req.body.name;
  const path = req.file?.path;
  if (!name || !path) {
    res.statusCode = 400;
    return res.json("Invalid Request");
  }
  if (!map.has(name)) {
    const newCat = {
      name,
      path,
    };
    map.set(name, newCat);
    // Created
    res.statusCode = 201;
    return res.json(newCat);
  } else {
    // Conflict
    res.statusCode = 400;
    return res.json("We've got this Cat");
  }
};

const updateCat = (req: Request, res: Response, next: NextFunction) => {
  const name = req.body.name;
  const path = req.file?.path;
  if (!name || !path) {
    res.statusCode = 400;
    return res.json("Invalid Request");
  }
  if (!map.has(name)) {
    // Created
    res.statusCode = 201;
  } else {
    // OK/Updated
    res.statusCode = 200;
  }
  const newCat = {
    name,
    path,
  };
  map.set(name, newCat);
  return res.json(newCat);
};

const deleteCat = (req: Request, res: Response, next: NextFunction) => {
  const name = req.params.name;
  const cat = map.get(name);
  if (cat) {
    map.delete(name);
    res.statusCode = 204;
    return res.json(`${name} has been removed`);
  } else {
    res.statusCode = 404;
    return res.json(`I don't have a cat named ${name}`);
  }
};

export default {
  getCats,
  getCat,
  addCat,
  updateCat,
  deleteCat,
  map,
  uploadImg,
};
