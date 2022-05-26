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

describe("Mjau DELETE Tests", () => {
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
  it("/DELETE/Binky with no Binky gets 404", async () => {
    let res = await request(app).delete(`/cat/Binky`);
    res.should.have.status(404);
  });
  it("/DELETE/Binky with Binky deletes Binky with 204", async () => {
    await helpers.makeCat("Binky", "Binky");
    let res = await request(app).delete(`/cat/Binky`);
    res.should.have.status(204);
    await helpers.checkNoCat("Binky");
    let listRes = await request(app).get("/cat");
    listRes.should.have.status(200);
    listRes.body.should.be.a("array");
    listRes.body.should.deep.equal([]);
  });
  it("/DELETE/Binky can't delete Binky twice with 404", async () => {
    await helpers.makeCat("Binky", "Binky");
    let res = await request(app).delete(`/cat/Binky`);
    res = await request(app).delete(`/cat/Binky`);
    res.should.have.status(404);
    await helpers.checkNoCat("Binky");
  });
  it("/DELETE/Jerry with 3 cats has Binky and Moe remain", async () => {
    await helpers.makeCat("Binky", "Binky");
    await helpers.makeCat("Jerry", "Jerry");
    await helpers.makeCat("Moe", "Moe");
    await helpers.checkCat("Jerry", "Jerry");
    let res = await request(app).delete(`/cat/Jerry`);
    res.should.have.status(204);
    await helpers.checkNoCat("Jerry");
    await helpers.checkCat("Binky", "Binky");
    await helpers.checkCat("Moe", "Moe");
    let getRes = await request(app).get("/cat");
    getRes.should.have.status(200);
    getRes.body.should.be.a("array");
    getRes.body.should.have.lengthOf(2);
    getRes.body.should.have.members(["Binky", "Moe"]);
  });
});
