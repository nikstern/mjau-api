import app from "../server";
import fs from "fs";
import path from "path";
import * as chai from "chai";
import chaiHttp = require("chai-http");
import "mocha";
import controller from "../controllers/cats";
import { chaiImage } from "chai-image";
chai.use(chaiHttp);
chai.use(chaiImage);
import { expect, request } from "chai";
import bodyParser = require("body-parser");
let should = chai.should();
import helpers from "./helpers";

describe("Mjau POST Tests", () => {
  afterEach((done) => {
    controller.map.clear();
    fs.readdir("uploads", (err, files) => {
      if (err) throw err;
      for (const file of files) {
        fs.unlink(path.join("uploads", file), (err) => {
          if (err) throw err;
        });
      }
    });
    done();
  });
  it("/POST/Binky with no Binky makes Binky and gets 201", async () => {
    const res = await helpers.makeCat("Binky", "Binky");
    res.body.should.be.a("object");
    res.body.should.have.property("name");
    res.body.name.should.equal("Binky");
    res.should.have.status(201);
    await helpers.checkCat("Binky", "Binky");
  }),
    it("/POST/Binky with no name field gets 400", async () => {
      const res = await request(app)
        .post("/cat/Binky")
        .set("content-type", "multipart/form-data")
        .attach(
          "file",
          fs.readFileSync("src/tests/images/Jerry.png"),
          "Jerry.jpg"
        );
      res.should.have.status(400);
      res.body.should.equal("Invalid Request");
      await helpers.checkNoCat("Binky");
    }),
    it("/POST/Binky with no image attached gets 400", async () => {
      const res = await request(app)
        .post("/cat/Binky")
        .set("content-type", "multipart/form-data")
        .field("name", "Binky");
      res.should.have.status(400);
      res.body.should.equal("Invalid Request");
      await helpers.checkNoCat("Binky");
    }),
    it("/POST/Binky with a text file image gets 400", async () => {
      const res = await request(app)
        .post("/cat/Binky")
        .set("content-type", "multipart/form-data")
        .attach(
          "file",
          fs.readFileSync("src/tests/images/input.txt"),
          "Jerry.png"
        );
      res.should.have.status(400);
      res.body.should.equal("Invalid Request");
      await helpers.checkNoCat("Binky");
    });
  it("/POST/Binky with Binky already gets 400", async () => {
    let res = await helpers.makeCat("Binky", "Binky");
    res.should.have.status(201);
    res.body.should.be.a("object");
    res.body.should.have.property("name");
    res.body.name.should.equal("Binky");
    // Duplicate Request
    res = await helpers.makeCat("Binky", "Jerry");
    res.should.have.status(400);
    res.body.should.equal("We've got this Cat");
    await helpers.checkCat("Binky", "Binky");
  });
});
