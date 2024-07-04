const blogsRouter = require("express").Router();
const Blog = require("../models/blogs");
const User = require("../models/users");

// const getTokenFrom = (request) => {
//   const authorization = request.get("authorization");
//   if (authorization && authorization.startsWith("Bearer ")) {
//     return authorization.replace("Bearer ", "");
//   }
//   return null;
// };

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", {
    username: 1,
    name: 1,
    id: 1,
  });
  response.json(blogs);
});

blogsRouter.post("/", async (request, response, next) => {
  const body = request.body;

  if (!request.user.id) {
    return response.status(401).json({ error: "token invalid" });
  }

  const user = await User.findById(request.user.id);

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: user._id,
  });

  try {
    if (!blog.title) {
      response.status(400).end();
    } else {
      const savedBlog = await blog.save();
      user.blogs = user.blogs.concat(savedBlog._id);
      await user.save();
      const returnedBlog = await Blog.findById(savedBlog._id).populate("user", {
        username: 1,
        name: 1,
        id: 1,
      });
      response.status(201).json(returnedBlog);
    }
  } catch (exception) {
    next(exception);
  }
});

blogsRouter.delete("/:id", async (request, response) => {
  const blog = await Blog.findById(request.params.id);

  const user = request.user;

  if (user.id.toString() !== blog.user.toString()) {
    return response.status(403).json({ error: "permission denied" });
  }

  await Blog.findByIdAndDelete(request.params.id);
  response.status(204).end();
});

blogsRouter.put("/:id", async (request, response) => {
  const body = request.body;

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
  };

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {
    new: true,
  });
  response.json(updatedBlog);
});

module.exports = blogsRouter;
