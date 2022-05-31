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
describe("Mjau Get Tests", () => {
  before(async () => {
    let res = await request(app)
      .post("/register")
      .send({ email: "test2", password: "test2" });
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
  it("/cats/Binky GET with no Binky gets 404", async () => {
    await helpers.checkNoCat("Binky", token);
  });
  it("/cats/Binky GET with Binky gets Binky image with 200", async () => {
    await helpers.putCat("Binky", "Binky", token);
    await helpers.checkCat("Binky", "Binky", token);
  });
  it("/cats/:id GET with 3 cats gets each cat with 200", async () => {
    await helpers.putCat("Binky", "Binky", token);
    await helpers.putCat("Jerry", "Jerry", token);
    await helpers.putCat("Moe", "Moe", token);
    await helpers.checkCat("Binky", "Binky", token);
    await helpers.checkCat("Jerry", "Jerry", token);
    await helpers.checkCat("Moe", "Moe", token);
  });
  it("/cats GET with no cats returns empty list with 200", async () => {
    let res = await request(app).get("/cats").set("x-access-token", token);
    res.should.have.status(200);
    res.body.should.be.a("array");
    res.body.should.deep.equal([]);
  });
  it("/cats GET with just Binky gets just Binky with 200", async () => {
    await helpers.makeCat("Binky", "Binky", token);
    let getRes = await request(app).get("/cats").set("x-access-token", token);
    getRes.should.have.status(200);
    getRes.body.should.be.a("array");
    getRes.body.should.have.lengthOf(1);
    getRes.body[0].should.equal("Binky");
  });
  it("/cats GET with two cats gets Binky and Jerry with 200", async () => {
    await helpers.makeCat("Binky", "Binky", token);
    await helpers.makeCat("Jerry", "Jerry", token);
    let getRes = await request(app).get("/cats").set("x-access-token", token);
    getRes.should.have.status(200);
    getRes.body.should.be.a("array");
    getRes.body.should.have.lengthOf(2);
    getRes.body.should.have.members(["Binky", "Jerry"]);
  });
});
