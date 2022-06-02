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
      `${catImageName}.png`
    );
  return res;
}
async function putCat(
  name: string,
  catImageName: string,
  token: string
): Promise<any> {
  const res = await request(app)
    .put(`/cats/${name}`)
    .set("content-type", "multipart/form-data")
    .set("x-access-token", token)
    .attach(
      "image",
      fs.readFileSync(`src/tests/images/${catImageName}.png`),
      `${catImageName}.png`
    );
  return res;
}

async function getCat(name: string, token: string) {
  return await request(app).get(`/cats/${name}`).set("x-access-token", token);
}

async function checkCat(name: string, catImageName: string, token: string) {
  let res = await getCat(name, token);
  const expected = fs.readFileSync(`src/tests/images/${catImageName}.png`);
  res.body.should.matchImage(expected);
}

async function checkNoCat(name: string, token: string) {
  let res = await getCat(name, token);
  res.should.have.status(404);
  res.body.message.should.equal(`I don't have a cat named ${name}`);
}

async function listCats(token: string) {
  return await request(app).get("/cats/").set("x-access-token", token);
}

async function deleteCat(name: string, token: string) {
  return await request(app)
    .delete(`/cats/${name}`)
    .set("x-access-token", token);
}

async function register(email: string, password: string) {
  return await request(app)
    .post("/register")
    .send({ email: email, password: password });
}

async function login(email: string, password: string) {
  return await request(app)
    .post("/login")
    .send({ email: email, password: password });
}

export default {
  getCat,
  checkCat,
  checkNoCat,
  makeCat,
  deleteCat,
  listCats,
  putCat,
  login,
  register,
};
