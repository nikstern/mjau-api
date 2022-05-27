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
let token: string;
describe("Mjau PUT Tests", () => {
  before(async () => {
    let res = await request(app)
      .post("/register")
      .send({ email: "test4", password: "test4" });
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
  it("/cats/Binky PUT with no Binky adds Binky with 201", async () => {
    let res = await helpers.putCat("Binky", "Binky", token);
    res.should.have.status(201);
    res.body.should.be.a("object");
    res.body.should.have.property("name");
    res.body.name.should.equal("Binky");
    await helpers.checkCat("Binky", "Binky", token);
  });
  it("/cats/Binky PUT with Binky already updates Binky with Jerry picture with 200", async () => {
    let res = await helpers.putCat("Binky", "Binky", token);
    res.should.have.status(201);
    res.body.should.be.a("object");
    res.body.should.have.property("name");
    res.body.name.should.equal("Binky");
    await helpers.checkCat("Binky", "Binky", token);
    res = await helpers.putCat("Binky", "Jerry", token);
    res.should.have.status(200);
    res.body.should.be.a("object");
    res.body.should.have.property("name");
    res.body.name.should.equal("Binky");
    await helpers.checkCat("Binky", "Jerry", token);
  });
  it("/cats/ PUT with no name gets 404", async () => {
    const res = await request(app)
      .put("/cats/")
      .set("content-type", "multipart/form-data")
      .set("x-access-token", token)
      .attach(
        "image",
        fs.readFileSync("src/tests/images/Jerry.png"),
        "Jerry.png"
      );
    res.should.have.status(404);
    await helpers.checkNoCat("Binky", token);
  }),
    it("/cats/Binky PUT with no image gets 400", async () => {
      const res = await request(app)
        .put("/cats/Binky")
        .set("x-access-token", token);
      res.should.have.status(400);
      res.body.message.should.equal("Invalid Request");
      await helpers.checkNoCat("Binky", token);
    }),
    it("/cats/Binky PUT with a text file gets 400", async () => {
      const res = await request(app)
        .put("/cats/Binky")
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
});
