const app = require("../app");
const request = require("supertest");
const knex = require("../db/connection");

describe("/", () => {
  beforeEach(() => knex.seed.run());
  afterAll(() => knex.destroy());
  test("GET all 404: Route does not exist", () => {
    return request(app)
      .get("/notARoute")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Route not found!");
      });
  });
  describe("/api", () => {
    describe("/topics", () => {
      describe("GET", () => {
        test("GET 200: responds with an array of topic objects", () => {
          return request(app)
            .get("/api/topics")
            .expect(200)
            .then(({ body: { topics } }) => {
              topics.forEach((topic) => {
                expect(topic).toEqual(
                  expect.objectContaining({
                    description: expect.any(String),
                    slug: expect.any(String),
                  })
                );
              });
            });
        });
      });
      describe("INVALID METHODS", () => {
        test("405: when request uses invalid method", () => {
          const invalidMethods = ["patch", "put", "delete"];
          const methodPromises = invalidMethods.map((method) => {
            return request(app)
              [method]("/api/topics")
              .expect(405)
              .then(({ body: { msg } }) => {
                expect(msg).toBe("Method not allowed!");
              });
          });
        });
      });
    });
    describe("/users", () => {
      describe("/:username", () => {
        describe("GET", () => {
          test("GET 200: responds with a user object", () => {
            return request(app)
              .get("/api/users/rogersop")
              .expect(200)
              .then(({ body: { user } }) => {
                expect(user).toEqual(
                  expect.objectContaining({
                    username: expect.any(String),
                    avatar_url: expect.any(String),
                    name: expect.any(String),
                  })
                );
              });
          });
          test("GET 404: user not found", () => {
            return request(app)
              .get("/api/users/notauser")
              .expect(404)
              .then(({ body: { msg } }) => {
                expect(msg).toBe("User not found!");
              });
          });
        });
        describe("INVALID METHODS", () => {
          test("405: when request uses invalid method", () => {
            const invalidMethods = ["patch", "put", "delete"];
            const methodPromises = invalidMethods.map((method) => {
              return request(app)
                [method]("/api/users/:username")
                .expect(405)
                .then(({ body: { msg } }) => {
                  expect(msg).toBe("Method not allowed!");
                });
            });
          });
        });
      });
    });
    describe.only("/articles", () => {
      describe("/:article_id", () => {
        describe("GET", () => {
          test("GET 200: responds with an article object", () => {
            return request(app)
              .get("/api/articles/1")
              .expect(200)
              .then(({ body: { article } }) => {
                expect(article).toEqual(
                  expect.objectContaining({
                    author: expect.any(String),
                    title: expect.any(String),
                    article_id: expect.any(Number),
                    body: expect.any(String),
                    topic: expect.any(String),
                    created_at: expect.any(String),
                    votes: expect.any(Number),
                    comment_count: expect.any(Number),
                  })
                );
              });
          });
        });
      });
    });
  });
});
