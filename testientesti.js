let _ = require("lodash");
const blogs = [
  {
    _id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    __v: 0,
  },
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0,
  },
  {
    _id: "5a422b3a1b54a676234d17f9",
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
    __v: 0,
  },
  {
    _id: "5a422b891b54a676234d17fa",
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
    __v: 0,
  },
  {
    _id: "5a422ba71b54a676234d17fb",
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
    __v: 0,
  },
  {
    _id: "5a422bc61b54a676234d17fc",
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
    __v: 0,
  },
];

const mostPopularAuthor = (array) => {
  let authors = _.map(array, "author");
  console.log(authors, "authooss");
  let mostCommonAuthor = _.maxBy(array, "author");
  let test = _.filter(array, { author: mostCommonAuthor.author });

  console.log(mostCommonAuthor, "toimiix");

  const obj = {
    author: mostCommonAuthor.author,
    blogs: test.length,
  };
  console.log(obj, "objjjjjj");
  return obj;

  console.log(test.length, "mätssss");
};

const { flow, countBy, toPairs, maxBy, tail, head } = _;

const fn = flow(
  (blogs) => countBy(blogs, "author"), // count by name
  toPairs, // convert to [key, value] pairs
  (blogs) => maxBy(blogs, tail), // find the max by the value (tail)
  head // get the key (head)
);

const res = fn(blogs);
//console.log(res, "ress");
const test = _.filter(blogs, function (o) {
  if (o.author == res) return o;
});
//console.log(test, "nytkö?!?!?");
const authorLikes = blogs.reduce((sum, { author, likes }) => {
  //console.log(author, likes, "TJSKJTSKJJKTSJK");
  sum[author] = sum[author] || 0;
  sum[author] += likes;
  return sum;
}, {});

console.log(authorLikes, "liket?");

const mostLikes = Object.keys(authorLikes).sort(
  (a, b) => authorLikes[b] - authorLikes[a]
)[0];

console.log(mostLikes, authorLikes[mostLikes]);
