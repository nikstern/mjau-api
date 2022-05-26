import app from "../server";
import fs from "fs";
import * as chai from "chai";
import chaiHttp = require("chai-http");
import "mocha";
import { chaiImage } from "chai-image";
chai.use(chaiHttp);
chai.use(chaiImage);
import { expect, request } from "chai";
let should = chai.should();

async function makeCat(name: string, catImageName: string): Promise<any> {
  const res = request(app)
    .post(`/cat/${name}`)
    .set("content-type", "multipart/form-data")
    .field("name", name)
    .attach(
      "file",
      fs.readFileSync(`src/tests/images/${catImageName}.png`),
      `${catImageName}.jpg`
    );
  return res;
}
async function putCat(name: string, catImageName: string): Promise<any> {
  const res = request(app)
    .put(`/cat/${name}`)
    .set("content-type", "multipart/form-data")
    .field("name", name)
    .attach(
      "file",
      fs.readFileSync(`src/tests/images/${catImageName}.png`),
      `${catImageName}.jpg`
    );
  return res;
}

async function checkCat(name: string, catImageName: string) {
  let res = await request(app).get(`/cat/${name}`);
  const expected = fs.readFileSync(`src/tests/images/${catImageName}.png`);
  res.body.should.matchImage(expected);
}

async function checkNoCat(name: string) {
  let res = await request(app).get(`/cat/${name}`);
  res.should.have.status(404);
  res.body.should.equal(`I don't have a cat named ${name}`);
}

export default { checkCat, checkNoCat, makeCat, putCat };
