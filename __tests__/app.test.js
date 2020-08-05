const app = require("../app");
const request = require("supertest");
const knex = require("../db/connection");

describe("/", () => {
  beforeEach(() => knex.seed.run());
  afterAll(() => knex.destroy());
  test("ALL 404: Route does not exist", () => {
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
          const invalidMethods = ["patch", "put", "post", "delete"];
          const methodPromises = invalidMethods.map((method) => {
            return request(app)
              [method]("/api/topics")
              .expect(405)
              .then(({ body: { msg } }) => {
                expect(msg).toBe("Method not allowed!");
              });
          });
          return Promise.all(methodPromises);
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
          test("GET 404: username not found", () => {
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
            const invalidMethods = ["patch", "put", "post", "delete"];
            const methodPromises = invalidMethods.map((method) => {
              return request(app)
                [method]("/api/users/:username")
                .expect(405)
                .then(({ body: { msg } }) => {
                  expect(msg).toBe("Method not allowed!");
                });
            });
            return Promise.all(methodPromises);
          });
        });
      });
    });
    describe("/articles", () => {
      describe("/:article_id", () => {
        describe("GET", () => {
          test("GET 200: responds with an article object", () => {
            return request(app)
              .get("/api/articles/1")
              .expect(200)
              .then(({ body: { article } }) => {
                expect(article).toEqual({
                  author: "butter_bridge",
                  title: "Living in the shadow of a great man",
                  article_id: 1,
                  body: "I find this existence challenging",
                  topic: "mitch",
                  created_at: "2018-11-15T12:21:54.171Z",
                  votes: 100,
                  comment_count: 13,
                });
              });
          });
          test("GET 400: article_id is wrong type", () => {
            return request(app)
              .get("/api/articles/bannana")
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).toBe("Bad request!");
              });
          });
          test("GET 404: article_id not found", () => {
            return request(app)
              .get("/api/articles/999999")
              .expect(404)
              .then(({ body: { msg } }) => {
                expect(msg).toBe("Article not found!");
              });
          });
        });
        describe("PATCH", () => {
          test("PATCH 200: responds with the updated article", () => {
            return request(app)
              .patch("/api/articles/1")
              .send({ inc_votes: 10 })
              .expect(200)
              .then(({ body: { updatedArticle } }) => {
                expect(updatedArticle).toEqual({
                  author: "butter_bridge",
                  title: "Living in the shadow of a great man",
                  article_id: 1,
                  body: "I find this existence challenging",
                  topic: "mitch",
                  created_at: "2018-11-15T12:21:54.171Z",
                  votes: 110,
                });
              });
          });
          test("PATCH 200: no changes if body empty / extra keys", () => {
            const requestBodies = [{}, { name: "mitch" }];
            const requestPromises = requestBodies.map((requestBody) => {
              return request(app)
                .patch("/api/articles/1")
                .send(requestBody)
                .expect(200)
                .then(({ body: { updatedArticle } }) => {
                  expect(updatedArticle).toEqual({
                    author: "butter_bridge",
                    title: "Living in the shadow of a great man",
                    article_id: 1,
                    body: "I find this existence challenging",
                    topic: "mitch",
                    created_at: "2018-11-15T12:21:54.171Z",
                    votes: 100,
                  });
                });
            });
            return Promise.all(requestPromises);
          });
          test("PATCH 400: invalid article_id", () => {
            return request(app)
              .patch("/api/articles/bannana")
              .send({ inc_votes: 10 })
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).toBe("Bad request!");
              });
          });
          test("PATCH 400: invalid inc_votes", () => {
            return request(app)
              .patch("/api/articles/1")
              .send({ inc_votes: "bannana" })
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).toBe("Bad request!");
              })
              .then(() => {
                return request(app)
                  .get("/api/articles/1")
                  .expect(200)
                  .then(({ body: { article } }) => {
                    expect(article.votes).toEqual(100);
                  });
              });
          });
          test("PATCH 404: article_id not found", () => {
            return request(app)
              .patch("/api/articles/999999")
              .send({ inc_votes: 10 })
              .expect(404)
              .then(({ body: { msg } }) => {
                expect(msg).toBe("Article not found!");
              });
          });
        });
      });
      describe("INVALID METHODS", () => {
        test("405: when request uses invalid method", () => {
          const invalidMethods = ["put", "post", "delete"];
          const methodPromises = invalidMethods.map((method) => {
            return request(app)
              [method]("/api/articles/:article_id")
              .expect(405)
              .then(({ body: { msg } }) => {
                expect(msg).toBe("Method not allowed!");
              });
          });
          return Promise.all(methodPromises);
        });
      });
    });
    describe.skip("/comments", () => {
      describe("POST", () => {
        test("POST 201: responds with the posted comment", () => {
          // Incomplete test
          return request(app)
            .post("/api/articles/:article_id/comments")
            .send({ username: "butter_bridge", body: "a new comment" })
            .expect(201);
        });
      });
    });
  });
});
