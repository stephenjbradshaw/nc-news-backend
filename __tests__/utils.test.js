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

describe("makeRefObj", () => {});

describe("formatComments", () => {});
