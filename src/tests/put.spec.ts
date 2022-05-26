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

describe("Mjau PUT Tests", () => {
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
  it("/cats/Binky PUT with no Binky adds Binky with 201", async () => {
    let res = await helpers.putCat("Binky", "Binky");
    res.should.have.status(201);
    res.body.should.be.a("object");
    res.body.should.have.property("name");
    res.body.name.should.equal("Binky");
    await helpers.checkCat("Binky", "Binky");
  });
  it("/cats/Binky PUT with Binky already updates Binky with Jerry picture with 200", async () => {
    let res = await helpers.putCat("Binky", "Binky");
    res.should.have.status(201);
    res.body.should.be.a("object");
    res.body.should.have.property("name");
    res.body.name.should.equal("Binky");
    await helpers.checkCat("Binky", "Binky");
    res = await helpers.putCat("Binky", "Jerry");
    res.should.have.status(200);
    res.body.should.be.a("object");
    res.body.should.have.property("name");
    res.body.name.should.equal("Binky");
    await helpers.checkCat("Binky", "Jerry");
  });
  it("/cats/Binky PUT with no name gets 400", async () => {
    const res = await request(app)
      .put("/cats/Binky")
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
    it("/cats/Binky PUT with no image gets 400", async () => {
      const res = await request(app)
        .put("/cats/Binky")
        .set("content-type", "multipart/form-data")
        .field("name", "Binky");
      res.should.have.status(400);
      res.body.should.equal("Invalid Request");
      await helpers.checkNoCat("Binky");
    }),
    it("/cats/Binky PUT with a text file gets 400", async () => {
      const res = await request(app)
        .put("/cats/Binky")
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
});
