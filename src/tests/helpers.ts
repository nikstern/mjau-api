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

async function makeCat(
  name: string,
  catImageName: string,
  token: string
): Promise<any> {
  const res = request(app)
    .post(`/cats/${name}`)
    .set("content-type", "multipart/form-data")
    .set("x-access-token", token)
    .attach(
      "image",
      fs.readFileSync(`src/tests/images/${catImageName}.png`),
      `${catImageName}.jpg`
    );
  return res;
}
async function putCat(
  name: string,
  catImageName: string,
  token: string
): Promise<any> {
  const res = request(app)
    .put(`/cats/${name}`)
    .set("content-type", "multipart/form-data")
    .set("x-access-token", token)
    .attach(
      "image",
      fs.readFileSync(`src/tests/images/${catImageName}.png`),
      `${catImageName}.jpg`
    );
  return res;
}

async function checkCat(name: string, catImageName: string, token: string) {
  let res = await request(app)
    .get(`/cats/${name}`)
    .set("x-access-token", token);
  const expected = fs.readFileSync(`src/tests/images/${catImageName}.png`);
  res.body.should.matchImage(expected);
}

async function checkNoCat(name: string, token: string) {
  let res = await request(app)
    .get(`/cats/${name}`)
    .set("x-access-token", token);
  res.should.have.status(404);
  res.body.message.should.equal(`I don't have a cat named ${name}`);
}

async function login(email: string, password: string): Promise<string> {
  let res = await request(app)
    .post("/login")
    .send({ email: email, password: password });
  res.should.have.status(200);
  return res.body.token;
}

export default { checkCat, checkNoCat, makeCat, putCat, login };
