var _ = require("lodash");

const dummy = (blogs) => {
  return 1;
};

const totalLikes = (array) => {
  const reducer = (sum, item) => {
    return sum + item.likes;
  };
  return array.reduce(reducer, 0);
};

const favoriteBlog = (array) => {
  const likes = array.map((x) => x.likes);
  const winner = Math.max(...likes);
  const mostLikesObj = array.filter((blog) => blog.likes === winner);
  // console.log(mostLikesObj, "bestest");
  const obj = {
    title: mostLikesObj[0].title,
    author: mostLikesObj[0].author,
    likes: mostLikesObj[0].likes,
  };

  return obj;
};

const mostPopularAuthor = (array) => {
  const { flow, countBy, toPairs, maxBy, tail, head } = _;

  const fn = flow(
    (array) => countBy(array, "author"), // count by name
    toPairs, // convert to [key, value] pairs
    (array) => maxBy(array, tail), // find the max by the value (tail)
    head // get the key (head)
  );

  const res = fn(array);
  // console.log(res, "ress");
  const test = _.filter(array, function (o) {
    if (o.author == res) return o;
  });
  const obj = {
    author: res,
    blogs: test.length,
  };
  console.log(obj, "bbbb");
  return obj;
};

const mostLiked = (array) => {
  let authorLikes = array.reduce((op, { author, likes }) => {
    op[author] = op[author] || 0;
    op[author] += likes;
    return op;
  }, {});

  console.log(authorLikes);

  let mostLikes = Object.keys(authorLikes).sort(
    (a, b) => authorLikes[b] - authorLikes[a]
  )[0];

  const obj = {
    author: mostLikes,
    likes: authorLikes[mostLikes],
  };
  console.log(mostLikes, authorLikes[mostLikes]);
  return obj;
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostPopularAuthor,
  mostLiked,
};
