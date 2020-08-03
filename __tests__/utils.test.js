const {
  formatDates,
  makeRefObj,
  formatComments,
} = require("../db/utils/utils");

describe("formatDates", () => {
  test("returns an empty array when passed an empty array", () => {
    expect(formatDates([])).toEqual([]);
  });
  test("formats a single article object", () => {
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
});

describe("makeRefObj", () => {});

describe("formatComments", () => {});
