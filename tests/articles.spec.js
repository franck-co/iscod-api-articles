const request = require("supertest");
const { app } = require("../server");
const jwt = require("jsonwebtoken");
const config = require("../config");
const mockingoose = require("mockingoose");
const { User, UserRole } = require("../api/users/users.schema");
const { Article } = require("../api/articles/articles.schema");
const { faker } = require("@faker-js/faker")

function getMockUser(role) {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const email = faker.internet.email({ firstName, lastName });
  return {
    _id: faker.database.mongodbObjectId(),
    name: faker.person.fullName({ firstName, lastName }),
    password: faker.internet.password({ length: 10, memorable: true }),
    email,
    date: faker.date.recent({ days: 365 }),
    age: faker.number.int(100),
    role
  }
}

function getMockArticle(writerId) {
  return {
    _id: faker.database.mongodbObjectId(),
    status: faker.helpers.arrayElement(['draft', 'published']),
    user: writerId,
    title: faker.company.catchPhrase(),
    content: faker.lorem.paragraphs(1),
  }
}

describe("tester API users", () => {

  const MOCK_ADMIN = getMockUser(UserRole.admin)
  const MOCK_MEMBER = getMockUser(UserRole.member)
  const MOCK_ARTICLE = getMockArticle(MOCK_MEMBER._id)


  test("[Articles] Create Article", async () => {

    //mock auth by member
    const token = jwt.sign({ userId: MOCK_MEMBER._id }, config.secretJwtToken);
    mockingoose(User).toReturn(MOCK_MEMBER, "findOne");

    //mock returned article
    mockingoose(Article).toReturn(MOCK_ARTICLE, "findOne");
    mockingoose(Article).toReturn(MOCK_ARTICLE, "save");

    const res = await request(app)
      .post("/api/articles")
      .send(MOCK_ARTICLE)
      .set("x-access-token", token);

    expect(res.status).toBe(201);
    expect(res.body.title).toBe(MOCK_ARTICLE.title);
    expect(res.body.user).toBe(MOCK_MEMBER._id);
  });

  test("[Articles] Update Article", async () => {
    //mock auth by admin
    const token = jwt.sign({ userId: MOCK_ADMIN._id }, config.secretJwtToken);
    mockingoose(User).toReturn(MOCK_ADMIN, "findOne");

    //mock an updated article
    const MOCK_NEW_TITLE = "I'm a new title"
    mockingoose(Article).toReturn({ ...MOCK_ARTICLE, title: MOCK_NEW_TITLE }, "findOneAndUpdate");

    const res = await request(app)
      .put(`/api/articles/${MOCK_ARTICLE._id}`)
      .send({ title: MOCK_NEW_TITLE })
      .set("x-access-token", token);

    expect(res.status).toBe(200);
    expect(res.body.title).toBe(MOCK_NEW_TITLE);
  });

  test("[Articles] Update Article forbidden for members", async () => {
    //mock auth by member
    const token = jwt.sign({ userId: MOCK_MEMBER._id }, config.secretJwtToken);
    mockingoose(User).toReturn(MOCK_MEMBER, "findOne");

    //mock an updated article
    const MOCK_NEW_TITLE = "I'm a new title"
    mockingoose(Article).toReturn({ ...MOCK_ARTICLE, title: MOCK_NEW_TITLE }, "findOneAndUpdate");

    const res = await request(app)
      .put(`/api/articles/${MOCK_ARTICLE._id}`)
      .send({ title: MOCK_NEW_TITLE })
      .set("x-access-token", token);

    expect(res.status).toBe(403);
  });

  test("[Articles] Delete Article", async () => {
    //mock auth by admin
    const token = jwt.sign({ userId: MOCK_ADMIN._id }, config.secretJwtToken);
    mockingoose(User).toReturn(MOCK_ADMIN, "findOne");

    const res = await request(app)
      .delete(`/api/articles/${MOCK_ARTICLE._id}`)
      .send()
      .set("x-access-token", token);

    expect(res.status).toBe(204);
  });

  test("[Articles] Delete Article forbidden for members", async () => {
    //mock auth by member
    const token = jwt.sign({ userId: MOCK_MEMBER._id }, config.secretJwtToken);
    mockingoose(User).toReturn(MOCK_MEMBER, "findOne");

    const res = await request(app)
      .delete(`/api/articles/${MOCK_ARTICLE._id}`)
      .send()
      .set("x-access-token", token);

    expect(res.status).toBe(403);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });
});
