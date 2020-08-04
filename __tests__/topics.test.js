const app = require("../app");
const request = require("supertest");
const knex = require("../db/connection");

describe("/api/topics", () => {
  beforeEach(() => knex.seed.run());
  afterAll(() => knex.destroy());
  describe("GET", () => {
    test("GET 200: responds with an array of topic objects", () => {
      return request(app).get("/api/topics").expect(200);
    });
  });
});
