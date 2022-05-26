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

describe("Mjau Get Tests", () => {
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
  it("/GET/Binky with no Binky gets 404", async () => {
    await helpers.checkNoCat("Binky");
  });
  it("/GET/Binky with Binky gets Binky image with 200", async () => {
    await helpers.putCat("Binky", "Binky");
    await helpers.checkCat("Binky", "Binky");
  });
  it("/GET/:id With 3 cats gets each cat with 200", async () => {
    await helpers.putCat("Binky", "Binky");
    await helpers.putCat("Jerry", "Jerry");
    await helpers.putCat("Moe", "Moe");
    await helpers.checkCat("Binky", "Binky");
    await helpers.checkCat("Jerry", "Jerry");
    await helpers.checkCat("Moe", "Moe");
  });
  it("/GET with no cats returns empty list with 200", async () => {
    let res = await request(app).get("/cat");
    res.should.have.status(200);
    res.body.should.be.a("array");
    res.body.should.deep.equal([]);
  });
  it("/GET with just Binky gets just Binky with 200", async () => {
    await helpers.makeCat("Binky", "Binky");
    let getRes = await request(app).get("/cat");
    getRes.should.have.status(200);
    getRes.body.should.be.a("array");
    getRes.body.should.have.lengthOf(1);
    getRes.body[0].should.have.property("name", "Binky");
  });
  it("/GET with two cats gets Binky and Jerry with 200", async () => {
    await helpers.makeCat("Binky", "Binky");
    await helpers.makeCat("Jerry", "Jerry");
    let getRes = await request(app).get("/cat");
    getRes.should.have.status(200);
    getRes.body.should.be.a("array");
    getRes.body.should.have.lengthOf(2);
    let kitties: string[] = [];
    getRes.body.map((e: any) => kitties.push(e.name));
    kitties.should.have.members(["Binky", "Jerry"]);
  });
});
