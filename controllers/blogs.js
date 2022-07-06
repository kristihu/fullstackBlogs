const blogsRouter = require("express").Router();
const Blog = require("../models/blog");

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({});

  response.json(blogs);
});

blogsRouter.post("/", async (request, response) => {
  const body = request.body;

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  });

  const savedBlog = await blog.save();
  response.status(201).json(savedBlog);
});

blogsRouter.get("/:id", async (request, response) => {
  const singleBlog = await Blog.findById(request.params.id);
  response.json(singleBlog.toJSON());
  response.status(201).end();
});

blogsRouter.delete("/:id", async (request, response) => {
  await Blog.findByIdAndRemove(request.params.id);
  response.status(204).end();
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
