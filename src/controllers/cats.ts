import { Request, Response, NextFunction } from "express";
import { Cat } from "../models/cats";
import path from "path";

const map = new Map<string, Cat>();

const getCat = (req: Request, res: Response, next: NextFunction) => {
  const name = req.params.name;
  const cat = map.get(name);
  if (cat) {
    return res.sendFile(path.resolve(cat.path));
  } else {
    return res
      .status(404)
      .json({ message: `I don't have a cat named ${name}` });
  }
};

const getCats = (req: Request, res: Response, next: NextFunction) => {
  return res.json(Array.from(map.keys()));
};

const addCat = (req: Request, res: Response, next: NextFunction) => {
  const name = req.params.name;
  if (name == undefined || !req.file) {
    return badRequest(req, res, next);
  }
  const path = req.file?.path;
  if (!map.has(name)) {
    const newCat = {
      name,
      path,
    };
    map.set(name, newCat);
    // Created
    return res.status(201).json({
      message: `Added a cat named ${name} with an image ${req.file.originalname}`,
    });
  } else {
    // Conflict
    return res.status(400).json({ message: "We've got this Cat" });
  }
};

const updateCat = (req: Request, res: Response, next: NextFunction) => {
  const name = req.params.name;
  const path = req.file?.path;
  if (name == undefined || path == undefined) {
    return badRequest(req, res, next);
  }
  let message: string;
  if (!map.has(name)) {
    // Created
    res.statusCode = 201;
    message = `Added a cat named ${name} with an image ${req.file?.originalname}`;
  } else {
    // OK/Updated
    res.statusCode = 200;
    message = `${name} now has the image ${req.file?.originalname}`;
  }
  const newCat = {
    name,
    path,
  };
  map.set(name, newCat);
  return res.json({
    message,
  });
};

const deleteCat = (req: Request, res: Response, next: NextFunction) => {
  const name = req.params.name;
  const cat = map.get(name);
  if (cat) {
    map.delete(name);
    return res.status(204).json({ message: `${name} has been removed` });
  } else {
    return res
      .status(404)
      .json({ message: `I don't have a cat named ${name}` });
  }
};

const badRequest = (req: Request, res: Response, next: NextFunction) => {
  return res.status(400).json({ message: "Invalid Request" });
};

export default {
  getCats,
  getCat,
  addCat,
  updateCat,
  deleteCat,
  badRequest,
  map,
};
