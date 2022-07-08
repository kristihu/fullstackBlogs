const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 });

  response.json(blogs);
});

blogsRouter.post("/", async (request, response) => {
  const body = request.body;
  //console.log(request.token, "tuleeko middlewaresta?");

  const decodedToken = jwt.verify(request.token, process.env.SECRET);
  console.log(decodedToken, "token??");
  if (!request.token || !decodedToken.id) {
    return response.status(401).json({ error: "token missing or invalid" });
  }
  const user = await User.findById(decodedToken.id);
  console.log(request.user.id, "juuseri???????");

  //const user = await User.findById(body.userId);
  console.log(request.user, "savedblogogogo");
  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user._id,
  });

  const savedBlog = await blog.save();

  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();
  response.status(201).json(savedBlog);
});

blogsRouter.get("/:id", async (request, response) => {
  const singleBlog = await Blog.findById(request.params.id);
  response.json(singleBlog.toJSON());
  response.status(201).end();
});

blogsRouter.delete("/:id", async (request, response) => {
  //console.log(request.params, "PARMETERRIT");

  const testBlog = await Blog.findById(request.params.id);

  //console.log(request.user, "juuseri");

  if (request.user.id.toString() === testBlog.user.toString()) {
    console.log("TOIMIIJEJEJEJEJE");
    await Blog.findByIdAndRemove(request.params.id);
    response.status(204).end();

    response.status(404).end();
  } else {
    response
      .status(401)
      .json({ error: "Invalid token, are you the user who posted the blog?" });
  }
});

blogsRouter.put("/:id", async (request, response, next) => {
  const body = request.body;
  const newLikes = { likes: body.likes };
  const test = await Blog.findByIdAndUpdate(request.params.id, newLikes, {
    new: true,
  });
  response.status(201).json(test);
});

module.exports = blogsRouter;
