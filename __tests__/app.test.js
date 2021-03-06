const app = require("../app");
const request = require("supertest");
const knex = require("../db/connection");

describe("/", () => {
  beforeEach(() => knex.seed.run());
  afterAll(() => knex.destroy());
  test("ALL 404: Route does not exist", () => {
    const methodsToCheck = ["get", "put", "post", "patch", "delete"];
    const methodPromises = methodsToCheck.map((method) => {
      return request(app)
        [method]("/notARoute")
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Route not found!");
        });
    });
    return Promise.all(methodPromises);
  });
  describe("/api", () => {
    test("GET 200: Responds with JSON representation of API", () => {
      return request(app)
        .get("/api")
        .expect(200)
        .then(({ body: { apiDescription } }) => {
          expect(apiDescription).toEqual(
            expect.objectContaining({
              "GET /api": expect.any(Object),
            })
          );
        });
    });
    test("405: when request uses invalid method", () => {
      const invalidMethods = ["put", "post", "patch", "delete"];
      const methodPromises = invalidMethods.map((method) => {
        return request(app)
          [method]("/api")
          .expect(405)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Method not allowed!");
          });
      });
      return Promise.all(methodPromises);
    });
    describe("/articles", () => {
      describe("GET", () => {
        test("GET 200: responds with an array of article objects, default sort", () => {
          return request(app)
            .get("/api/articles")
            .expect(200)
            .then(({ body: { articles } }) => {
              expect(articles.length).toBe(12);
              expect(articles).toBeSortedBy("created_at", {
                descending: true,
              });
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
        describe("Sort queries", () => {
          test("GET 200: custom sort column, defaults to descending if order not specified", () => {
            return request(app)
              .get("/api/articles?sort_by=author")
              .expect(200)
              .then(({ body: { articles } }) => {
                expect(articles.length).toBe(12);
                expect(articles).toBeSortedBy("author", {
                  descending: true,
                });
              });
          });
          test("GET 400: invalid sort order", () => {
            return request(app)
              .get("/api/articles?sort_by=author&order=bannana")
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).toBe("Bad request!");
              });
          });
          test("GET 200: custom sort column, custom order", () => {
            return request(app)
              .get("/api/articles?sort_by=title&order=asc")
              .expect(200)
              .then(({ body: { articles } }) => {
                expect(articles.length).toBe(12);
                expect(articles).toBeSortedBy("title", {
                  descending: false,
                });
              });
          });
          test("GET 200: responds with default sort if invalid query", () => {
            return request(app)
              .get("/api/articles?apple=bannana")
              .expect(200)
              .then(({ body: { articles } }) => {
                expect(articles.length).toBe(12);
                expect(articles).toBeSortedBy("created_at", {
                  descending: true,
                });
              });
          });
          test("GET 400: specified sort column does not exist", () => {
            return request(app)
              .get("/api/articles?sort_by=bannana")
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).toBe("Bad request!");
              });
          });
        });
        describe("Filter queries", () => {
          test("GET 200: can filter by author where the author exists", () => {
            return request(app)
              .get("/api/articles/?author=rogersop")
              .expect(200)
              .then(({ body: { articles } }) => {
                expect(articles.length).toBe(3);
                articles.forEach((article) => {
                  expect(article.author).toBe("rogersop");
                });
              });
          });
          test("GET 200: no results after filtering by an author that exists", () => {
            return request(app)
              .get("/api/articles?author=lurker")
              .expect(200)
              .then(({ body: { articles } }) => {
                expect(articles).toEqual([]);
              });
          });
          test("GET 404: no results after filtering by an author that does not exist)", () => {
            return request(app)
              .get("/api/articles?author=bannana")
              .expect(404)
              .then(({ body: { msg } }) => {
                expect(msg).toBe("User not found!");
              });
          });
          test("GET 200: can filter by topic where the topic exists", () => {
            return request(app)
              .get("/api/articles/?topic=mitch")
              .expect(200)
              .then(({ body: { articles } }) => {
                expect(articles.length).toBe(11);
                articles.forEach((article) => {
                  expect(article.topic).toBe("mitch");
                });
              });
          });
          test("GET 200: no results after filtering by a topic that exists)", () => {
            return request(app)
              .get("/api/articles?topic=paper")
              .expect(200)
              .then(({ body: { articles } }) => {
                expect(articles).toEqual([]);
              });
          });
          test("GET 404: no results after filtering by a topic that does not exist", () => {
            return request(app)
              .get("/api/articles?topic=badger")
              .expect(404)
              .then(({ body: { msg } }) => {
                expect(msg).toBe("Topic not found!");
              });
          });
          test("GET 200: can filter by author AND topic where both exist", () => {
            return request(app)
              .get("/api/articles?author=rogersop&topic=mitch")
              .expect(200)
              .then(({ body: { articles } }) => {
                expect(articles.length).toBe(2);
                articles.forEach((article) => {
                  expect(article.author).toBe("rogersop");
                  expect(article.topic).toBe("mitch");
                });
              });
          });
          test("GET 200: no results after filtering by author AND topic where both exist)", () => {
            return request(app)
              .get("/api/articles?topic=paper&author=lurker")
              .expect(200)
              .then(({ body: { articles } }) => {
                expect(articles).toEqual([]);
              });
          });
          test("GET 404: no results after filtering by author AND topic where author does not exist", () => {
            return request(app)
              .get("/api/articles?author=bannana&topic=mitch")
              .expect(404)
              .then(({ body: { msg } }) => {
                expect(msg).toBe("User not found!");
              });
          });
          test("GET 404: no results after filtering by author AND topic where topic does not exist", () => {
            return request(app)
              .get("/api/articles?author=rogersop&topic=bannana")
              .expect(404)
              .then(({ body: { msg } }) => {
                expect(msg).toBe("Topic not found!");
              });
          });
          test("GET 404: no results after filtering by author AND topic where neither exist", () => {
            return request(app)
              .get("/api/articles?author=bannana&topic=bannana")
              .expect(404)
              .then(({ body: { msg } }) => {
                expect(msg).toBe("User not found!");
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
              .then(({ body: { article } }) => {
                expect(article).toEqual({
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
              .then(({ body: { article } }) => {
                expect(article).toEqual({
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
                .then(({ body: { article } }) => {
                  expect(article).toEqual({
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
                        author: expect.any(String),
                        article_id: expect.any(Number),
                        votes: expect.any(Number),
                        created_at: expect.any(String),
                        body: expect.any(String),
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
                  expect(comments).toBeSortedBy("author", {
                    descending: true,
                  });
                });
            });
            test("GET 400: invalid sort order", () => {
              return request(app)
                .get("/api/articles/1/comments?sort_by=votes&order=bannana")
                .expect(400)
                .then(({ body: { msg } }) => {
                  expect(msg).toBe("Bad request!");
                });
            });
            test("GET 200: custom sort column, custom order", () => {
              return request(app)
                .get("/api/articles/1/comments?sort_by=votes&order=asc")
                .expect(200)
                .then(({ body: { comments } }) => {
                  expect(comments.length).toBe(13);
                  expect(comments).toBeSortedBy("votes", {
                    descending: false,
                  });
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
                .then(({ body: { comment } }) => {
                  expect(comment).toEqual({
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
    describe("/comments", () => {
      describe("/:comment_id", () => {
        describe("GET", () => {
          test("GET 200: Responds with a comment object", () => {
            return request(app)
              .get("/api/comments/1")
              .expect(200)
              .then(({ body: { comment } }) => {
                expect(comment).toEqual(
                  expect.objectContaining({
                    comment_id: 1,
                    body:
                      "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
                    article_id: 9,
                    author: "butter_bridge",
                    votes: 16,
                    created_at: "2017-11-22T12:36:03.389Z",
                  })
                );
              });
          });
          test("GET 400: invalid comment_id", () => {
            return request(app)
              .get("/api/comments/bannana")
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).toBe("Bad request!");
              });
          });
          test("GET 404: comment_id not found", () => {
            return request(app)
              .get("/api/comments/999999")
              .expect(404)
              .then(({ body: { msg } }) => {
                expect(msg).toBe("Comment not found!");
              });
          });
        });
        describe("PATCH", () => {
          test("PATCH 200: responds with the updated comment", () => {
            return request(app)
              .patch("/api/comments/1")
              .send({ inc_votes: 1 })
              .expect(200)
              .then(({ body: { comment } }) => {
                expect(comment).toEqual({
                  comment_id: 1,
                  body:
                    "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
                  article_id: 9,
                  author: "butter_bridge",
                  votes: 17,
                  created_at: "2017-11-22T12:36:03.389Z",
                });
              });
          });
          test("PATCH 200: updates if extra key on body", () => {
            return request(app)
              .patch("/api/comments/1")
              .send({ inc_votes: 1, name: "mitch" })
              .expect(200)
              .then(({ body: { comment } }) => {
                expect(comment).toEqual({
                  comment_id: 1,
                  body:
                    "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
                  article_id: 9,
                  author: "butter_bridge",
                  votes: 17,
                  created_at: "2017-11-22T12:36:03.389Z",
                });
              });
          });
          test("PATCH 200: no changes if body empty / wrong key", () => {
            const requestBodies = [{}, { name: "mitch" }];
            const requestPromises = requestBodies.map((requestBody) => {
              return request(app)
                .patch("/api/comments/1")
                .send(requestBody)
                .expect(200)
                .then(({ body: { comment } }) => {
                  expect(comment).toEqual({
                    comment_id: 1,
                    body:
                      "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
                    article_id: 9,
                    author: "butter_bridge",
                    votes: 16,
                    created_at: "2017-11-22T12:36:03.389Z",
                  });
                });
            });
            return Promise.all(requestPromises);
          });
          test("PATCH 400: invalid comment_id", () => {
            return request(app)
              .patch("/api/comments/badger")
              .send({ inc_votes: 10 })
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).toBe("Bad request!");
              });
          });
          test("PATCH 400: invalid inc_votes value", () => {
            return request(app)
              .patch("/api/comments/1")
              .send({ inc_votes: "bannana" })
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).toBe("Bad request!");
              })
              .then(() => {
                return request(app)
                  .get("/api/comments/1")
                  .expect(200)
                  .then(({ body: { comment } }) => {
                    expect(comment.votes).toEqual(16);
                  });
              });
          });
          test("PATCH 404: comment_id not found", () => {
            return request(app)
              .patch("/api/comments/999999")
              .send({ inc_votes: 10 })
              .expect(404)
              .then(({ body: { msg } }) => {
                expect(msg).toBe("Comment not found!");
              });
          });
        });
        describe("DELETE", () => {
          test("DELETE 204: comment deleted", () => {
            return request(app)
              .delete("/api/comments/1")
              .expect(204)
              .then(() => {
                return request(app)
                  .get("/api/comments/1")
                  .expect(404)
                  .then(({ body: { msg } }) => {
                    expect(msg).toBe("Comment not found!");
                  });
              });
          });
          test("DELETE 400: invalid comment_id", () => {
            return request(app)
              .delete("/api/comments/bannana")
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).toBe("Bad request!");
              });
          });
          test("DELETE 404: comment_id not found", () => {
            return request(app)
              .delete("/api/comments/999999")
              .expect(404)
              .then(({ body: { msg } }) => {
                expect(msg).toBe("Comment not found!");
              });
          });
        });
        describe("INVALID METHODS", () => {
          test("405: when request uses invalid method", () => {
            const invalidMethods = ["put", "post"];
            const methodPromises = invalidMethods.map((method) => {
              return request(app)
                [method]("/api/comments/1")
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
      describe("/:slug", () => {
        describe("GET", () => {
          test("GET 200: responds with a topic object", () => {
            return request(app)
              .get("/api/topics/mitch")
              .expect(200)
              .then(({ body: { topic } }) => {
                expect(topic).toEqual({
                  description: "The man, the Mitch, the legend",
                  slug: "mitch",
                });
              });
          });
          test("GET 404: topic not found", () => {
            return request(app)
              .get("/api/topics/notATopic")
              .expect(404)
              .then(({ body: { msg } }) => {
                expect(msg).toBe("Topic not found!");
              });
          });
        });
        describe("INVALID METHODS", () => {
          test("405: when request uses invalid method", () => {
            const invalidMethods = ["put", "post", "patch", "delete"];
            const methodPromises = invalidMethods.map((method) => {
              return request(app)
                [method]("/api/topics/mitch")
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
  });
});
