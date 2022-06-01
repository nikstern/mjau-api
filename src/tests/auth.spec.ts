import app from "../server";
import * as chai from "chai";
import "mocha";
import { request } from "chai";
import { chaiImage } from "chai-image";
import chaiHttp = require("chai-http");
chai.use(chaiHttp);
chai.use(chaiImage);

import helpers from "./helpers";
describe("Mjau Authentication Tests", async () => {
  it("/cats/* Rejects all data endpoints without Authorization with 403", async () => {
    (await request(app).get("/cats")).should.have.status(403);
    (await request(app).get("/cats/Binky")).should.have.status(403);
    (await request(app).post("/cats/Binky")).should.have.status(403);
    (await request(app).put("/cats/Binky")).should.have.status(403);
    (await request(app).delete("/cats/Binky")).should.have.status(403);
  });
  it("/cats/* Rejects all data endpoints with an invalid token with 401", async () => {
    let token = "BlahBlahBlah";
    (await helpers.listCats(token)).should.have.status(401);
    (await helpers.getCat("Binky", token)).should.have.status(401);
    (await helpers.makeCat("Binky", "Binky", token)).should.have.status(401);
    (await helpers.putCat("Binky", "Binky", token)).should.have.status(401);
    (await helpers.deleteCat("Binky", token)).should.have.status(401);
  });
  it("/register POST rejects signup with missing emails or passwords with 400", async () => {
    (await request(app).post("/register")).should.have.status(400);
    (
      await request(app).post("/register").send({ email: "test" })
    ).should.have.status(400);
    (
      await request(app).post("/register").send({ password: "test" })
    ).should.have.status(400);
  });
  it("/register POST allows valid user signup with 201", async () => {
    let res = await helpers.register("authtest1", "test1");
    res.should.have.status(201);
    res.should.have.property("body");
    res.body.should.have.property("token");
    let token = res.body.token;
    (await helpers.listCats(token)).should.have.status(200);
  });
  it("/register POST rejects duplicate account creation with 409", async () => {
    (await helpers.register("authtest2", "test2")).should.have.status(201);
    (await helpers.register("authtest2", "test2")).should.have.status(409);
  });
  it("/login POST allows valid user login with 200", async () => {
    (await helpers.register("authtest3", "test3")).should.have.status(201);
    let res = await helpers.login("authtest3", "test3");
    res.should.have.status(200);
    res.should.have.property("body");
    res.body.should.have.property("token");
    let token = res.body.token;
    (await helpers.listCats(token)).should.have.status(200);
  });
  it("/login POST rejects wrong password with 400", async () => {
    (await helpers.register("authtest4", "test4")).should.have.status(201);
    let res = await helpers.login("authtest4", "wrong");
    res.should.have.status(400);
    res.should.have.property("body");
    res.body.should.not.have.property("token");
  });
  it("/login POST rejects wrong user with 400", async () => {
    (await helpers.register("authtest5", "test5")).should.have.status(201);
    let res = await helpers.login("authtest10", "test5");
    res.should.have.status(400);
    res.should.have.property("body");
    res.body.should.not.have.property("token");
  });
});
