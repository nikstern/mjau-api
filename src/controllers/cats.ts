import { Request, Response, NextFunction } from "express";
import { Cat } from "../models/cats";
import path from "path";

const map = new Map<string, Cat>();

const getCat = (req: Request, res: Response, next: NextFunction) => {
  const name = req.params.name;
  const cat = map.get(name);
  if (cat) {
    return res.sendFile(path.resolve(cat.path.toString()));
  } else {
    res.statusCode = 404;
    return res.json({ message: `I don't have a cat named ${name}` });
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
    res.statusCode = 201;
    return res.json({ name: name });
  } else {
    // Conflict
    res.statusCode = 400;
    return res.json({ message: "We've got this Cat" });
  }
};

const updateCat = (req: Request, res: Response, next: NextFunction) => {
  const name = req.params.name;
  const path = req.file?.path;
  if (name == undefined || path == undefined) {
    return badRequest(req, res, next);
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
  return res.json({ name: name });
};

const deleteCat = (req: Request, res: Response, next: NextFunction) => {
  const name = req.params.name;
  const cat = map.get(name);
  if (cat) {
    map.delete(name);
    res.statusCode = 204;
    return res.json({ message: `${name} has been removed` });
  } else {
    res.statusCode = 404;
    return res.json({ message: `I don't have a cat named ${name}` });
  }
};

const badRequest = (req: Request, res: Response, next: NextFunction) => {
  res.statusCode = 400;
  return res.json({ message: "Invalid Request" });
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
