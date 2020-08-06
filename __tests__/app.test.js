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
                [method]("/api/users/rogersop")
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
      describe("GET", () => {
        test("GET 200: responds with an array of article objects", () => {
          return request(app)
            .get("/api/articles")
            .expect(200)
            .then(({ body: { articles } }) => {
              articles.forEach((article) => {
                expect(article).toEqual(
                  expect.objectContaining({
                    author: expect.any(String),
                    title: expect.any(String),
                    article_id: expect.any(Number),
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
      describe("INVALID METHODS", () => {
        test("405: when request uses invalid method", () => {
          const invalidMethods = ["put", "post", "patch", "delete"];
          const methodPromises = invalidMethods.map((method) => {
            return request(app)
              [method]("/api/articles")
              .expect(405)
              .then(({ body: { msg } }) => {
                expect(msg).toBe("Method not allowed!");
              });
          });
          return Promise.all(methodPromises);
        });
      });
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
          test("GET 400: invalid article_id", () => {
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
          test("PATCH 200: updates if extra key on body", () => {
            return request(app)
              .patch("/api/articles/1")
              .send({ inc_votes: 10, name: "mitch" })
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
          test("PATCH 200: no changes if body empty / wrong key", () => {
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
          test("PATCH 400: invalid inc_votes value", () => {
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
        describe("INVALID METHODS", () => {
          test("405: when request uses invalid method", () => {
            const invalidMethods = ["put", "post", "delete"];
            const methodPromises = invalidMethods.map((method) => {
              return request(app)
                [method]("/api/articles/1")
                .expect(405)
                .then(({ body: { msg } }) => {
                  expect(msg).toBe("Method not allowed!");
                });
            });
            return Promise.all(methodPromises);
          });
        });
        describe("/comments", () => {
          describe("GET", () => {
            test("GET 200: responds with array of comments, default sort", () => {
              return request(app)
                .get("/api/articles/1/comments")
                .expect(200)
                .then(({ body: { comments } }) => {
                  expect(comments.length).toBe(13);
                  expect(comments).toBeSortedBy("created_at", {
                    descending: true,
                  });
                  comments.forEach((comment) => {
                    expect(comment).toEqual(
                      expect.objectContaining({
                        comment_id: expect.any(Number),
                        votes: expect.any(Number),
                        created_at: expect.any(String),
                        author: expect.any(String),
                      })
                    );
                  });
                });
            });
            test("GET 200: custom sort column, defaults to descending if order not specified", () => {
              return request(app)
                .get("/api/articles/1/comments?sort_by=author")
                .expect(200)
                .then(({ body: { comments } }) => {
                  expect(comments.length).toBe(13);
                  expect(comments).toBeSortedBy("author", { descending: true });
                });
            });
            test("GET 200: custom sort column, defaults to descending if invalid order", () => {
              return request(app)
                .get("/api/articles/1/comments?sort_by=votes&order=bannana")
                .expect(200)
                .then(({ body: { comments } }) => {
                  expect(comments.length).toBe(13);
                  expect(comments).toBeSortedBy("votes", { descending: true });
                });
            });
            test("GET 200: custom sort column, custom order", () => {
              return request(app)
                .get("/api/articles/1/comments?sort_by=votes&order=asc")
                .expect(200)
                .then(({ body: { comments } }) => {
                  expect(comments.length).toBe(13);
                  expect(comments).toBeSortedBy("votes", { descending: false });
                });
            });
            test("GET 200: responds with default sort if invalid query", () => {
              return request(app)
                .get("/api/articles/1/comments?apple=bannana")
                .expect(200)
                .then(({ body: { comments } }) => {
                  expect(comments.length).toBe(13);
                  expect(comments).toBeSortedBy("created_at", {
                    descending: true,
                  });
                });
            });
            test("GET 400: specified sort column does not exist", () => {
              return request(app)
                .get("/api/articles/1/comments?sort_by=bannana")
                .expect(400)
                .then(({ body: { msg } }) => {
                  expect(msg).toBe("Bad request!");
                });
            });
            test("GET 400: article_id is wrong type", () => {
              return request(app)
                .get("/api/articles/bannana/comments")
                .expect(400)
                .then(({ body: { msg } }) => {
                  expect(msg).toBe("Bad request!");
                });
            });
            test("GET 404: article not found", () => {
              return request(app)
                .get("/api/articles/999999/comments")
                .expect(404)
                .then(({ body: { msg } }) => {
                  expect(msg).toBe("Article not found!");
                });
            });
            test("GET 200: article found but no comments", () => {
              return request(app)
                .get("/api/articles/7/comments")
                .expect(200)
                .then(({ body: { comments } }) => {
                  expect(comments).toEqual([]);
                });
            });
          });
          describe("POST", () => {
            test("POST 201: responds with the posted comment", () => {
              return request(app)
                .post("/api/articles/1/comments")
                .send({ username: "butter_bridge", body: "a new comment" })
                .expect(201)
                .then(({ body: { insertedComment } }) => {
                  expect(insertedComment).toEqual({
                    article_id: 1,
                    author: "butter_bridge",
                    body: "a new comment",
                    comment_id: 19,
                    votes: 0,
                    created_at: expect.any(String),
                  });
                });
            });
            test("POST 400: element of posted comment breaks not-null constraint", () => {
              return request(app)
                .post("/api/articles/1/comments")
                .send({ body: "a new comment" })
                .expect(400)
                .then(({ body: { msg } }) => {
                  expect(msg).toBe("Bad request!");
                });
            });
            test("POST 404: value not found in linked table", () => {
              return request(app)
                .post("/api/articles/1/comments")
                .send({ username: "notAUser", body: "a new comment" })
                .expect(404)
                .then(({ body: { msg } }) => {
                  expect(msg).toBe("Value not found!");
                });
            });
          });
          describe("INVALID METHODS", () => {
            test("405: when request uses invalid method", () => {
              const invalidMethods = ["put", "patch", "delete"];
              const methodPromises = invalidMethods.map((method) => {
                return request(app)
                  [method]("/api/articles/1/comments")
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
    });
  });
});
