import app from "../server";
import fs from "fs";
import path from "path";
import * as chai from "chai";
import "mocha";
import controller from "../controllers/cats";
import { request } from "chai";
import { chaiImage } from "chai-image";
import chaiHttp = require("chai-http");
chai.use(chaiHttp);
chai.use(chaiImage);

import helpers from "./helpers";
let token: string;
describe("Mjau DELETE Tests", async () => {
  before(async () => {
    let res = await request(app)
      .post("/register")
      .send({ email: "test", password: "test" });
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
  it("/cats/Binky DELETE with no Binky gets 404", async () => {
    let res = await request(app)
      .delete(`/cats/Binky`)
      .set("x-access-token", token);
    res.should.have.status(404);
  });
  it("/cats/Binky DELETE with Binky deletes Binky with 200", async () => {
    await helpers.makeCat("Binky", "Binky", token);
    let res = await request(app)
      .delete(`/cats/Binky`)
      .set("x-access-token", token);
    res.should.have.status(200);
    res.body.should.have.property("message");
    res.body.message.should.equal("Deleted Binky");
    await helpers.checkNoCat("Binky", token);
    let listRes = await request(app).get("/cats").set("x-access-token", token);
    listRes.should.have.status(200);
    listRes.body.should.be.a("array");
    listRes.body.should.deep.equal([]);
  });
  it("/cats/Binky DELETE can't delete Binky twice with 404", async () => {
    await helpers.makeCat("Binky", "Binky", token);
    let res = await request(app)
      .delete(`/cats/Binky`)
      .set("x-access-token", token);
    res = await request(app).delete(`/cats/Binky`).set("x-access-token", token);
    res.should.have.status(404);
    await helpers.checkNoCat("Binky", token);
  });
  it("/cats/Jerry DELETE with Jerry, Binky, and Moe has Binky and Moe remain", async () => {
    await helpers.makeCat("Binky", "Binky", token);
    await helpers.makeCat("Jerry", "Jerry", token);
    await helpers.makeCat("Moe", "Moe", token);
    await helpers.checkCat("Jerry", "Jerry", token);
    let res = await request(app)
      .delete(`/cats/Jerry`)
      .set("x-access-token", token);
    res.should.have.status(200);
    res.body.should.have.property("message");
    res.body.message.should.equal("Deleted Jerry");
    await helpers.checkNoCat("Jerry", token);
    await helpers.checkCat("Binky", "Binky", token);
    await helpers.checkCat("Moe", "Moe", token);
    let getRes = await request(app).get("/cats").set("x-access-token", token);
    getRes.should.have.status(200);
    getRes.body.should.be.a("array");
    getRes.body.should.have.lengthOf(2);
    getRes.body.should.have.members(["Binky", "Moe"]);
  });
});
