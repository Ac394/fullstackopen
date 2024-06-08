const _ = require("lodash");

const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0);
};

const favoriteBlog = (blogs) => {
  return blogs.reduce(
    (prev, curr) => (prev.likes > curr.likes ? prev : curr),
    {}
  );
};

const mostBlogs = (blogs) => {
  const result = {};
  [result.author, result.blogs] = _(blogs)
    .countBy("author")
    .entries()
    .maxBy(_.last);
  return result;
};

const mostLikes = (blogs) => {
  const result = {};
  [result.author, result.likes] = _(blogs)
    .groupBy("author")
    .mapValues((o) => _.sumBy(o, "likes"))
    .toPairs()
    .maxBy(_.last);

  return result;
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
