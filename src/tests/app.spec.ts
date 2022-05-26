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

async function makeCat(name: string): Promise<any> {
  const res = request(app)
    .post(`/cat/${name}`)
    .set("content-type", "multipart/form-data")
    .field("name", name)
    .attach(
      "file",
      fs.readFileSync(`src/tests/images/${name}.png`),
      `${name}.jpg`
    );
  return res;
}

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
    const res = await makeCat("Binky");
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
          fs.readFileSync("src/tests/images/Jerry.png"),
          "Jerry.jpg"
        );
      res.should.have.status(400);
      res.body.should.equal("Invalid Name");
    }),
    it("/POST Rejects a cat with no image with 400", async () => {
      const res = await request(app)
        .post("/cat/Binky")
        .set("content-type", "multipart/form-data")
        .field("name", "Binky");
      res.should.have.status(400);
      res.body.should.equal("Invalid Path");
    }),
    it("/POST Rejects Duplicate With 400", async () => {
      let res = await makeCat("Binky");
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
          fs.readFileSync("src/tests/images/Jerry.png"),
          "Binky.jpg"
        );
      res.should.have.status(400);
      res.body.should.equal("We've got this Cat");
    });
  it("/GET/:id Gets a Cat that exists in storage", async () => {
    let postRes = await makeCat("Binky");
    let getRes = await request(app).get("/cat/Binky");
    getRes.should.have.status(200);
    const expected = fs.readFileSync("src/tests/images/Binky.png");
    getRes.body.should.matchImage(expected);
  });
  it("/GET/:id Rejects a missing Cat with 404", async () => {
    let res = await request(app).get("/cat/Binky");
    res.should.have.status(404);
    res.body.should.equal("I don't have a cat named Binky");
  });
  it("/GET with no Cats returns empty list", async () => {
    let res = await request(app).get("/cat");
    res.should.have.status(200);
    res.body.should.be.a("array");
    res.body.should.deep.equal([]);
  });
  it("/GET with one Cat gets Binky", async () => {
    await makeCat("Binky");
    let getRes = await request(app).get("/cat");
    getRes.should.have.status(200);
    getRes.body.should.be.a("array");
    getRes.body.should.have.lengthOf(1);
    getRes.body[0].should.have.property("name", "Binky");
  });
  it("/GET with two cats gets Binky and Jerry", async () => {
    await makeCat("Binky");
    await makeCat("Jerry");
    let getRes = await request(app).get("/cat");
    getRes.should.have.status(200);
    getRes.body.should.be.a("array");
    getRes.body.should.have.lengthOf(2);
    let kitties: string[] = [];
    getRes.body.map((e: any) => kitties.push(e.name));
    kitties.should.have.members(["Binky", "Jerry"]);
  });
});
