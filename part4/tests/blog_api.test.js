const { test, after, beforeEach, before, describe } = require("node:test");
const assert = require("node:assert");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const bcrypt = require("bcrypt");

const helper = require("./test_helper");

const Blog = require("../models/blogs");
const User = require("../models/users");

describe("when there is initially some blogs saved", () => {
  let token;

  before(async () => {
    await User.deleteMany({});

    const newUser = {
      username: "testUser",
      name: "test123",
      password: "testUser123",
    };

    await api.post("/api/users").send(newUser);

    const result = await api.post("/api/login").send(newUser);

    token = result.body.token;
  });

  beforeEach(async () => {
    await Blog.deleteMany({});
    await Blog.insertMany(helper.initialBlogs);
    console.log("db reseted");

    //   for (let blog of helper.initialBlogs) {
    //     let blogObject = new Blog(blog);
    //     await blogObject.save();
    //   }
  });

  test("blogs are returned as json", async () => {
    await api
      .get("/api/blogs")
      .set("Authorization", `Bearer ${token}`)
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("the unique identifier property of blog is named id", async () => {
    const response = await api
      .get("/api/blogs")
      .set("Authorization", `Bearer ${token}`);

    const blog = response.body[0];

    assert(Object.hasOwn(blog, "id"));
  });

  test("a blog can be added", async () => {
    const newBlog = {
      title: "Hello",
      author: "Test",
      url: "https://hello-test.com/",
      likes: 15,
    };

    await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const response = await api
      .get("/api/blogs")
      .set("Authorization", `Bearer ${token}`);

    const savedBlog = response.body.at(-1);

    assert.strictEqual(response.body.length, helper.initialBlogs.length + 1);
    assert.strictEqual(savedBlog.title, newBlog.title);
    assert.strictEqual(savedBlog.author, newBlog.author);
    assert.strictEqual(savedBlog.url, newBlog.url);
    assert.strictEqual(savedBlog.likes, newBlog.likes);
  });

  test("likes property defaults to 0 when it's missing", async () => {
    const newBlog = {
      title: "Hello",
      author: "Test",
      url: "https://hello-test.com/",
    };

    await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const response = await api
      .get("/api/blogs")
      .set("Authorization", `Bearer ${token}`);

    const savedBlog = response.body.at(-1);

    assert.strictEqual(savedBlog.likes, 0);
  });

  test("fails with 400 if title property is missing", async () => {
    const newBlog = {
      author: "Test",
      url: "https://hello-test.com/",
      likes: 15,
    };

    await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${token}`)
      .send(newBlog)
      .expect(400);
  });

  describe("deletion of a blog", () => {
    test("succeeds with a status of 204 if blog is deleted", async () => {
      const newBlog = {
        title: "Hello",
        author: "Test",
        url: "https://hello-test.com/",
      };

      await api
        .post("/api/blogs")
        .set("Authorization", `Bearer ${token}`)
        .send(newBlog);

      const blogsBefore = await helper.blogsInDb();
      const blogToDelete = blogsBefore.at(-1);

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(204);

      const blogsAfter = await helper.blogsInDb();

      assert.strictEqual(blogsAfter.length, blogsBefore.length - 1);

      await api
        .get(`/api/blogs/${blogToDelete.id}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(404);
    });
  });

  test("a blog can be updated", async () => {
    const blogsBefore = await helper.blogsInDb();
    const blogToUpdate = blogsBefore[0];

    const updatedBlog = { ...blogToUpdate, likes: 30 };

    const response = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .set("Authorization", `Bearer ${token}`)
      .send(updatedBlog);

    const blogAfter = response.body;

    assert.strictEqual(updatedBlog.likes, blogAfter.likes);
  });
});

describe("when there is initially one user in db", () => {
  beforeEach(async () => {
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash("sekret", 10);
    const user = new User({ username: "root", passwordHash });

    await user.save();
  });

  test("creation succeeds with a fresh username", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "mluukkai",
      name: "Matti Luukkainen",
      password: "salainen",
    };

    await api
      .post("/api/users")
      .send(newUser)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1);

    const usernames = usersAtEnd.map((u) => u.username);
    assert(usernames.includes(newUser.username));
  });

  test("creation fails with proper statuscode and message if username already taken", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "root",
      name: "Superuser",
      password: "salainen",
    };

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    assert(result.body.error.includes("expected `username` to be unique"));

    assert.strictEqual(usersAtEnd.length, usersAtStart.length);
  });

  test("creation fails with proper statuscode and message if username is too short", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "im",
      name: "User1",
      password: "wasd123",
    };

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    assert(
      result.body.error.includes("expected username length to be longer than 3")
    );

    assert.strictEqual(usersAtEnd.length, usersAtStart.length);
  });

  test("creation fails with proper statuscode and message if password is too short", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "imshort",
      name: "User1",
      password: "we",
    };

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(403)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    assert(
      result.body.error.includes("expected password length to be longer than 3")
    );

    assert.strictEqual(usersAtEnd.length, usersAtStart.length);
  });
});

after(async () => {
  await mongoose.connection.close();
});
