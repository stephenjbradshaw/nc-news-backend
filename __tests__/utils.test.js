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
  test.only("returns an empty array when passed an empty array", () => {
    expect(formatComments([])).toEqual([]);
  });
  test.only("returns a single-object array with renamed created_by key when passed a single-object array", () => {
    const comment = {
      created_by: "icellusedkars",
    };
    expect(formatComment(comment)).toEqual({
      author: "icellusedkars",
    });
  });
  test("returns a correctly-formatted multi-object array when passed a multi-object array", () => {
    //
  });
  test("unformatted keys persist in the returned object", () => {
    //
  });
  test("returned array and objects have new references", () => {
    //
  });
  test("input is not mutated", () => {
    //
  });
});
