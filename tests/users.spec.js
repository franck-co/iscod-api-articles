const request = require("supertest");
const { app } = require("../server");
const jwt = require("jsonwebtoken");
const config = require("../config");
const mongoose = require("mongoose");
const mockingoose = require("mockingoose");
const {User} = require("../api/users/users.schema");
const usersService = require("../api/users/users.service");
describe("tester API users", () => {
  let token;
  const USER_ID = "fake";
  const WRONG_USER_ID = "wrong";
  const MOCK_DATA = [
    {
      _id: USER_ID,
      name: "ana",
      email: "nfegeg@gmail.com",
      password: "azertyuiop",
    },
  ];
  const MOCK_DATA_CREATED = {
    name: "test",
    email: "test@test.net",
    password: "azertyuiop",
  };

  beforeEach(() => {
    token = jwt.sign({ userId: USER_ID }, config.secretJwtToken);
    mockingoose(User).toReturn(MOCK_DATA, "find");
    mockingoose(User).toReturn(MOCK_DATA[0], "findOne");
    mockingoose(User).toReturn(MOCK_DATA_CREATED, "save");
  });

  test("[Users] Get All", async () => {
    const res = await request(app)
      .get("/api/users")
      .set("x-access-token", token);
    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  test("[Users] Create User", async () => {
    const res = await request(app)
      .post("/api/users")
      .send(MOCK_DATA_CREATED)
      .set("x-access-token", token);
    expect(res.status).toBe(201);
    expect(res.body.name).toBe(MOCK_DATA_CREATED.name);
  });

  test("[Users] Create User", async () => {
    const res = await request(app)
      .post("/api/users")
      .send(MOCK_DATA_CREATED)
      .set("x-access-token", token);
    expect(res.status).toBe(201);
    expect(res.body.name).toBe(MOCK_DATA_CREATED.name);
  });

  test("Est-ce userService.getAll", async () => {
    const spy = jest
      .spyOn(usersService, "getAll")
      .mockImplementation(() => "test");
    await request(app).get("/api/users").set("x-access-token", token);
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveReturnedWith("test");
  });

  test("[Users] me", async()=>{
    const res = await request(app)
    .get("/api/users/me")
    .set("x-access-token", token);
    expect(res.status).toBe(200);
    expect(res.body.name).toBe(MOCK_DATA[0].name);
    expect(res.body.email).toBe(MOCK_DATA[0].email);
  })

  test("[Users] me (not found)", async()=>{
    mockingoose(User).toReturn(null, "findOne");
    const res = await request(app)
    .get("/api/users/me")
    .set("x-access-token", jwt.sign({ userId: WRONG_USER_ID }, config.secretJwtToken));
    //401 because if user is not found, authorisation is declined
    expect(res.status).toBe(401);
  })

  afterEach(() => {
    jest.restoreAllMocks();
  });
});
