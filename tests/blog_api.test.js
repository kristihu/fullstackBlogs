const mongoose = require("mongoose");
const supertest = require("supertest");
const { describe } = require("yargs");
const app = require("../app");
const helper = require("./test_helper");
const api = supertest(app);
const bcrypt = require("bcryptjs");
const Blog = require("../models/blog");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

test("blogs are returned as json", async () => {
  await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/);
});

test("there are two blogs", async () => {
  const response = await api.get("/api/blogs");

  expect(response.body).toHaveLength(2);
});

test("does blog have _id", async () => {
  const response = await api.get("/api/blogs");
  // console.log(response.body[0].id, "response:)");

  expect(response.body[0].id).toBeDefined();
});

test("can a new blog be added, async", async () => {
  const blogsInDb = async () => {
    const blogs = await Blog.find({});
    return blogs.map((blog) => blog.toJSON());
  };
  const blogObj = {
    title: "tuleetestistä14",
    author: "testiauthor2",
    url: "testiurl2",
    likes: "44",
  };
  const blogsInBase = await blogsInDb();
  await api
    .post("/api/blogs")
    .set(
      "Authorization",
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3RtaWRkbGV3YXJlMjM0IiwiaWQiOiI2MmM4MTYyZWRkYmVkYTM1ZWZjMmE5ODIiLCJpYXQiOjE2NTcyODAxOTB9.mkBOyu92Opsjus5496GHXQRjZQU2dXdBG5gDwiOgDjc"
    )
    .send(blogObj)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const testi = await blogsInDb();

  console.log(blogsInBase.length, testi.length, "TOIMIIKOOOOO");
  expect(testi).toHaveLength(blogsInBase.length + 1);
  const blogsReturned = testi.map((b) => b.title);

  expect(blogsReturned).toContain("tuleetestistä14");
});

test("does likes default value work?", async () => {
  const blogsInDb = async () => {
    const blogs = await Blog.find({});
    return blogs.map((blog) => blog.toJSON());
  };

  const blogObj = {
    title: "tuleetestistä33312",
    author: "testiauthor2",
    url: "testiurl2",
    likes: "",
  };

  await api
    .post("/api/blogs")
    .send(blogObj)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const getBlogs = await blogsInDb();

  const blogsReturned = getBlogs.map((b) => b.likes);

  console.log(blogsReturned[blogsReturned.length - 1], "täältä tulee plokeja");

  expect(blogsReturned[blogsReturned.length - 1]).toBe(0);
});

test("does test return bad request?", async () => {
  let error = null;
  const blogObj = {
    title: "tuleetestistä14",
    author: "sff",
    url: "",
    likes: "44",
  };

  try {
    await api
      .post("/api/blogs")

      .send(blogObj)
      .expect(201)
      .expect("Content-Type", /application\/json/);
  } catch (e) {
    console.log(e, "EEEEEETERNALENVY");
    error = e;
  }
  expect(error).not.toBeNull();
});

test("deleting a single blog", async () => {
  const currentBlogs = await helper.blogsInDb();
  const testsDelete = currentBlogs[0];

  await api.delete(`/api/blogs/${testsDelete.id}`).expect(204);

  const blogsAfterDelete = await helper.blogsInDb();

  expect(blogsAfterDelete).toHaveLength(currentBlogs.length - 1);
  const blogsContains = blogsAfterDelete.map((b) => b.id);

  expect(blogsContains).not.toContain(testsDelete.id);
});

test("editing blogs likecount", async () => {
  const currentBlogs = await helper.blogsInDb();
  console.log(currentBlogs, "blogit?");
  const blogToEdit = currentBlogs[0];
  const newLikes = 222;

  await api
    .put(`/api/blogs/${blogToEdit.id}`)
    .send({ likes: newLikes })
    .expect(201);

  const blogsAfterDelete = await helper.blogsInDb();
  console.log(blogsAfterDelete, "uudet");
  expect(blogsAfterDelete[0].likes).toBe(newLikes);
});

test("creation succeeds with a fresh username", async () => {
  const usersAtStart = await helper.usersInDb();

  const newUser = {
    username: "ssssfffff",
    name: "jokunen",
    password: "asdfg",
  };

  await api
    .post("/api/users")
    .send(newUser)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const usersAtEnd = await helper.usersInDb();
  expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);

  const usernames = usersAtEnd.map((u) => u.username);
  expect(usernames).toContain(newUser.username);
});

test("creation fails with existing username or too short username", async () => {
  const usersAtStart = await helper.usersInDb();

  const newUser = {
    username: "sss",
    name: "jokunen",
    password: "asdfg",
  };

  await api
    .post("/api/users")
    .send(newUser)
    .expect(400)
    .expect("Content-Type", /application\/json/);
});

test("login?", async () => {
  const newUser = {
    name: "jokunen",
    password: "asdfg",
  };

  api.post("/api/login").send(newUser).expect(200).end(onResponse);

  function onResponse(err, req, res) {
    const authorization = res.get("authorization");
    console.log(authorization, "TESTSTTSTSTT");
    return;
  }
});

afterAll(() => {
  mongoose.connection.close();
});
