const {
  formatDates,
  makeRefObj,
  formatComments,
} = require("../db/utils/utils");

describe("formatDates", () => {
  test("returns an empty array when passed an empty array", () => {
    expect(formatDates([])).toEqual([]);
  });
  test("formats timestamp of a single article object", () => {
    const article = [
      {
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: 1542284514171,
        votes: 100,
      },
    ];
    const formattedArticle = formatDates(article);
    expect(formattedArticle[0]).toEqual(
      expect.objectContaining({
        ...article[0],
        created_at: expect.any(Date),
      })
    );
    expect(formattedArticle[0].created_at.toISOString()).toBe(
      "2018-11-15T12:21:54.171Z"
    );
  });
  test("formats timestamp of multiple article objects", () => {
    const articles = [
      {
        title: "Eight pug gifs that remind me of mitch",
        topic: "mitch",
        author: "icellusedkars",
        body: "some gifs",
        created_at: 1289996514171,
      },
      {
        title: "Student SUES Mitch!",
        topic: "mitch",
        author: "rogersop",
        body: "Typing is too loud",
        created_at: 1163852514171,
      },
      {
        title: "UNCOVERED: catspiracy to bring down democracy",
        topic: "cats",
        author: "rogersop",
        body: "The cats are taking arms!",
        created_at: 1037708514171,
      },
    ];
    const formattedArticles = formatDates(articles);
    formattedArticles.forEach((article) => {
      expect(article).toEqual(
        expect.objectContaining({
          ...article,
          created_at: expect.any(Date),
        })
      );
    });
  });
  test("returned array and objects have new references", () => {
    const articles = [
      {
        title: "Eight pug gifs that remind me of mitch",
        topic: "mitch",
        author: "icellusedkars",
        body: "some gifs",
        created_at: 1289996514171,
      },
      {
        title: "Student SUES Mitch!",
        topic: "mitch",
        author: "rogersop",
        body: "Typing is too loud",
        created_at: 1163852514171,
      },
      {
        title: "UNCOVERED: catspiracy to bring down democracy",
        topic: "cats",
        author: "rogersop",
        body: "The cats are taking arms!",
        created_at: 1037708514171,
      },
    ];
    const formattedArticles = formatDates(articles);
    expect(formattedArticles).not.toBe(articles);
    formattedArticles.forEach((article, index) => {
      expect(article).not.toBe(articles[index]);
    });
  });
  test("input is not mutated", () => {
    const articles = [
      {
        title: "Eight pug gifs that remind me of mitch",
        topic: "mitch",
        author: "icellusedkars",
        body: "some gifs",
        created_at: 1289996514171,
      },
      {
        title: "Student SUES Mitch!",
        topic: "mitch",
        author: "rogersop",
        body: "Typing is too loud",
        created_at: 1163852514171,
      },
    ];
    formatDates(articles);
    expect(articles).toEqual([
      {
        title: "Eight pug gifs that remind me of mitch",
        topic: "mitch",
        author: "icellusedkars",
        body: "some gifs",
        created_at: 1289996514171,
      },
      {
        title: "Student SUES Mitch!",
        topic: "mitch",
        author: "rogersop",
        body: "Typing is too loud",
        created_at: 1163852514171,
      },
    ]);
  });
});

describe("makeRefObj", () => {
  test("returns an empty object when passed an empty array", () => {
    expect(makeRefObj([])).toEqual({});
  });
  test("returns a single-item reference object with passed a single-object array", () => {
    const articles = [
      {
        article_id: 3,
        title: "Eight pug gifs that remind me of mitch",
        body: "some gifs",
      },
    ];
    const articleRef = makeRefObj(articles, "title", "article_id");
    expect(articleRef).toEqual({
      "Eight pug gifs that remind me of mitch": 3,
    });
  });
  test("returns a multi-item reference object when passed a multi-object array", () => {
    const articles = [
      {
        article_id: 5,
        title: "UNCOVERED: catspiracy to bring down democracy",
        body: "Bastet walks amongst us, and the cats are taking arms!",
      },
      {
        article_id: 6,
        title: "A",
        body: "Delicious tin of cat food",
      },
      {
        article_id: 7,
        title: "Z",
        body: "I was hungry.",
      },
    ];
    const articleRef = makeRefObj(articles, "title", "article_id");
    expect(articleRef).toEqual({
      "UNCOVERED: catspiracy to bring down democracy": 5,
      A: 6,
      Z: 7,
    });
  });

  test("input is not mutated", () => {
    const articles = [
      {
        article_id: 5,
        title: "UNCOVERED: catspiracy to bring down democracy",
        body: "Bastet walks amongst us, and the cats are taking arms!",
      },
      {
        article_id: 6,
        title: "A",
        body: "Delicious tin of cat food",
      },
      {
        article_id: 7,
        title: "Z",
        body: "I was hungry.",
      },
    ];
    makeRefObj(articles, "title", "article_id");
    expect(articles).toEqual([
      {
        article_id: 5,
        title: "UNCOVERED: catspiracy to bring down democracy",
        body: "Bastet walks amongst us, and the cats are taking arms!",
      },
      {
        article_id: 6,
        title: "A",
        body: "Delicious tin of cat food",
      },
      {
        article_id: 7,
        title: "Z",
        body: "I was hungry.",
      },
    ]);
  });
});

describe("formatComments", () => {
  test("returns an empty array when passed an empty array", () => {
    expect(formatComments([])).toEqual([]);
  });
  test("returns a single-object array with renamed created_by key when passed a single-object array", () => {
    const article = [
      {
        article_id: 9,
        title: "They're not exactly dogs, are they?",
        topic: "mitch",
        author: "butter_bridge",
        body: "Well? Think about it.",
        created_at: 533132514171,
      },
    ];
    const lookup = makeRefObj(article, "title", "article_id");
    const comment = [
      {
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        belongs_to: "They're not exactly dogs, are they?",
        created_by: "butter_bridge",
        votes: 16,
        created_at: 1511354163389,
      },
    ];
    const formattedComment = formatComments(comment, lookup);
    expect(formattedComment[0]).toHaveProperty("author", "butter_bridge");
    expect(formattedComment[0]).not.toHaveProperty("created_by");
  });
  test("returns a single-object array with formatted article_id", () => {
    const article = [
      {
        article_id: 9,
        title: "They're not exactly dogs, are they?",
        topic: "mitch",
        author: "butter_bridge",
        body: "Well? Think about it.",
        created_at: 533132514171,
      },
    ];
    const lookup = makeRefObj(article, "title", "article_id");
    const comment = [
      {
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        belongs_to: "They're not exactly dogs, are they?",
        created_by: "butter_bridge",
        votes: 16,
        created_at: 1511354163389,
      },
    ];
    const formattedComment = formatComments(comment, lookup);
    expect(formattedComment[0]).toHaveProperty("article_id", 9);
    expect(formattedComment[0]).not.toHaveProperty("belongs_to");
  });
  test("returns a single-object array with formatted created_at property", () => {
    const article = [
      {
        article_id: 9,
        title: "They're not exactly dogs, are they?",
        topic: "mitch",
        author: "butter_bridge",
        body: "Well? Think about it.",
        created_at: 533132514171,
      },
    ];
    const lookup = makeRefObj(article, "title", "article_id");
    const comment = [
      {
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        belongs_to: "They're not exactly dogs, are they?",
        created_by: "butter_bridge",
        votes: 16,
        created_at: 1511354163389,
      },
    ];
    const formattedComment = formatComments(comment, lookup);
    expect(formattedComment[0].created_at).toEqual(expect.any(Date));
    expect(formattedComment[0].created_at.toISOString()).toBe(
      "2017-11-22T12:36:03.389Z"
    );
  });
  test("returns a correctly-formatted multi-object array when passed a multi-object array", () => {
    const articles = [
      {
        article_id: 6,
        title: "A",
        topic: "mitch",
        author: "icellusedkars",
        body: "Delicious tin of cat food",
      },
      {
        article_id: 9,
        title: "They're not exactly dogs, are they?",
        topic: "mitch",
        author: "butter_bridge",
        body: "Well? Think about it.",
      },
      {
        article_id: 1,
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        votes: 100,
      },
    ];
    const lookup = makeRefObj(articles, "title", "article_id");
    const comments = [
      {
        body: "This is a bad article name",
        belongs_to: "A",
        created_by: "butter_bridge",
        votes: 1,
        created_at: 1038314163389,
      },
      {
        body: "The owls are not what they seem.",
        belongs_to: "They're not exactly dogs, are they?",
        created_by: "icellusedkars",
        votes: 20,
        created_at: 1006778163389,
      },
      {
        body: "This morning, I showered for nine minutes.",
        belongs_to: "Living in the shadow of a great man",
        created_by: "butter_bridge",
        votes: 16,
        created_at: 975242163389,
      },
    ];
    const formattedComments = formatComments(comments, lookup);
    formattedComments.forEach((comment) => {
      expect(comment).toEqual(
        expect.objectContaining({
          body: expect.any(String),
          article_id: expect.any(Number),
          author: expect.any(String),
          votes: expect.any(Number),
          created_at: expect.any(Date),
        }),
        expect.not.objectContaining({
          belongs_to: expect.any(String),
          created_by: expect.any(String),
        })
      );
    });
  });
  test("returned array and objects have new references", () => {
    const articles = [
      {
        article_id: 6,
        title: "A",
        topic: "mitch",
        author: "icellusedkars",
        body: "Delicious tin of cat food",
      },
      {
        article_id: 9,
        title: "They're not exactly dogs, are they?",
        topic: "mitch",
        author: "butter_bridge",
        body: "Well? Think about it.",
      },
      {
        article_id: 1,
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        votes: 100,
      },
    ];
    const lookup = makeRefObj(articles, "title", "article_id");
    const comments = [
      {
        body: "This is a bad article name",
        belongs_to: "A",
        created_by: "butter_bridge",
        votes: 1,
        created_at: 1038314163389,
      },
      {
        body: "The owls are not what they seem.",
        belongs_to: "They're not exactly dogs, are they?",
        created_by: "icellusedkars",
        votes: 20,
        created_at: 1006778163389,
      },
      {
        body: "This morning, I showered for nine minutes.",
        belongs_to: "Living in the shadow of a great man",
        created_by: "butter_bridge",
        votes: 16,
        created_at: 975242163389,
      },
    ];
    const formattedComments = formatComments(comments, lookup);
    expect(formattedComments).not.toBe(comments);
    formattedComments.forEach((comment, index) => {
      expect(comment).not.toBe(comments[index]);
    });
  });
  test("input is not mutated", () => {
    const articles = [
      {
        article_id: 6,
        title: "A",
        topic: "mitch",
        author: "icellusedkars",
        body: "Delicious tin of cat food",
      },
      {
        article_id: 9,
        title: "They're not exactly dogs, are they?",
        topic: "mitch",
        author: "butter_bridge",
        body: "Well? Think about it.",
      },
      {
        article_id: 1,
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        votes: 100,
      },
    ];
    const lookup = makeRefObj(articles, "title", "article_id");
    const comments = [
      {
        body: "This is a bad article name",
        belongs_to: "A",
        created_by: "butter_bridge",
        votes: 1,
        created_at: 1038314163389,
      },
      {
        body: "The owls are not what they seem.",
        belongs_to: "They're not exactly dogs, are they?",
        created_by: "icellusedkars",
        votes: 20,
        created_at: 1006778163389,
      },
      {
        body: "This morning, I showered for nine minutes.",
        belongs_to: "Living in the shadow of a great man",
        created_by: "butter_bridge",
        votes: 16,
        created_at: 975242163389,
      },
    ];
    const formattedComments = formatComments(comments, lookup);
    expect(comments).toEqual([
      {
        body: "This is a bad article name",
        belongs_to: "A",
        created_by: "butter_bridge",
        votes: 1,
        created_at: 1038314163389,
      },
      {
        body: "The owls are not what they seem.",
        belongs_to: "They're not exactly dogs, are they?",
        created_by: "icellusedkars",
        votes: 20,
        created_at: 1006778163389,
      },
      {
        body: "This morning, I showered for nine minutes.",
        belongs_to: "Living in the shadow of a great man",
        created_by: "butter_bridge",
        votes: 16,
        created_at: 975242163389,
      },
    ]);
  });
});
