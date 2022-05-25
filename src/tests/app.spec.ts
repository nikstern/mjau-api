import app from "../server";
import fs from "fs";
import path from "path";
import * as chai from "chai";
import chaiHttp = require("chai-http");
import "mocha";
import controller from "../controllers/cats";

chai.use(chaiHttp);
import { request } from "chai";
let should = chai.should();

describe("Mjau API Requests", () => {
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
  it("/POST Adds a brand new cat with 201", async () => {
    const res = await request(app)
      .post("/cat/Binky")
      .set("content-type", "multipart/form-data")
      .field("name", "Binky")
      .attach(
        "file",
        fs.readFileSync("src/tests/images/Binky.jpg"),
        "Binky.jpg"
      );
    res.body.should.be.a("object");
    res.body.should.have.property("name");
    res.body.name.should.equal("Binky");
    res.should.have.status(201);
  }),
    it("/POST Rejects Cat with no name with 400", async () => {
      const res = await request(app)
        .post("/cat/Binky")
        .set("content-type", "multipart/form-data")
        .attach(
          "file",
          fs.readFileSync("src/tests/images/Jerry.jpg"),
          "Jerry.jpg"
        );
      res.should.have.status(400);
      res.body.should.equal("Invalid Name");
    }),
    it("/POST Rejects Duplicate With 400", async () => {
      let res = await request(app)
        .post("/cat/Binky")
        .set("content-type", "multipart/form-data")
        .field("name", "Binky")
        .attach(
          "file",
          fs.readFileSync("src/tests/images/Binky.jpg"),
          "Binky.jpg"
        );
      res.should.have.status(201);
      res.body.should.be.a("object");
      res.body.should.have.property("name");
      res.body.name.should.equal("Binky");
      // Duplicate Request
      res = await request(app)
        .post("/cat/Binky")
        .set("content-type", "multipart/form-data")
        .field("name", "Binky")
        .attach(
          "file",
          fs.readFileSync("src/tests/images/Jerry.jpg"),
          "Binky.jpg"
        );
      res.should.have.status(400);
      res.body.should.equal("We've got this Cat");
    });
});
