import { Request, Response, NextFunction } from "express";
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
import { User } from "../models/user";

const userMap = new Map<string, User>();

const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    if (!(email && password)) {
      return res.status(400).send("Email and password are required");
    }
    const existingUser = userMap.get(email);
    if (existingUser) {
      return res
        .status(409)
        .send("There is an account with that email. Login instead.");
    }
    let encryptedPassword = await bcrypt.hash(password, 10);

    const token = jwt.sign({ email }, process.env.TOKEN_KEY, {
      expiresIn: "2h",
    });
    const newUser = {
      email: email.toLowerCase(),
      password: encryptedPassword,
      token,
    };
    userMap.set(email, newUser);
    res.status(201).json(newUser);
  } catch (err) {
    console.log(err);
  }
};

const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    if (!(email && password)) {
      return res.status(400).send("Email and password are required");
    }
    const user = userMap.get(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign({ email }, process.env.TOKEN_KEY, {
        expiresIn: "2h",
      });
      user.token = token;
      userMap.set(email, user);
      return res.status(200).json(user);
    }
    return res.status(400).send("Invalid Credentials");
  } catch (err) {
    console.log(err);
  }
};

export default { register, login };
