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
import { request } from "chai";
let should = chai.should();
import helpers from "./helpers";
let token: string;
describe("Mjau POST Tests", () => {
  before(async () => {
    let res = await request(app)
      .post("/register")
      .send({ email: "test3", password: "test3" });
    token = res.body.token;
  });
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
  it("/cats/Binky POST with no Binky makes Binky and gets 201", async () => {
    const res = await helpers.makeCat("Binky", "Binky", token);
    res.body.should.be.a("object");
    res.body.should.have.property("message");
    res.body.message.should.equal(
      "Added a cat named Binky with an image Binky.png"
    );
    res.should.have.status(201);
    await helpers.checkCat("Binky", "Binky", token);
  });
  it("/cats/ POST with no name field gets 404", async () => {
    const res = await request(app)
      .post("/cats/")
      .set("content-type", "multipart/form-data")
      .set("x-access-token", token)
      .attach(
        "image",
        fs.readFileSync("src/tests/images/Jerry.png"),
        "Jerry.png"
      );
    res.should.have.status(404);
    await helpers.checkNoCat("Binky", token);
  });
  it("/cats/Binky POST with a text file image gets 400", async () => {
    const res = await request(app)
      .post("/cats/Binky")
      .set("content-type", "multipart/form-data")
      .set("x-access-token", token)
      .attach(
        "image",
        fs.readFileSync("src/tests/images/input.txt"),
        "input.txt"
      );
    res.should.have.status(400);
    res.body.message.should.equal("Invalid Request");
    await helpers.checkNoCat("Binky", token);
  });
  it("/cats/Binky POST with Binky already gets 400", async () => {
    let res = await helpers.makeCat("Binky", "Binky", token);
    res.should.have.status(201);
    res.body.should.be.a("object");
    res.body.should.have.property("message");
    res.body.message.should.equal(
      "Added a cat named Binky with an image Binky.png"
    );
    // Duplicate Request
    res = await helpers.makeCat("Binky", "Jerry", token);
    res.should.have.status(400);
    res.body.message.should.equal("We've got this Cat");
    await helpers.checkCat("Binky", "Binky", token);
  });
});
