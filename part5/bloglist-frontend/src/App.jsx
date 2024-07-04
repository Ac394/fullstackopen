import { useState, useEffect, useRef } from "react";
import Blog from "./components/Blog";
import LoginForm from "./components/LoginForm";
import blogService from "./services/blogs";
import loginService from "./services/login";
import Notification from "./components/Notification";
import BlogsForm from "./components/BlogsForm";
import Togglable from "./components/Togglable";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [newBlogTitle, setNewBlogTitle] = useState("");
  const [newBlogAuthor, setNewBlogAuthor] = useState("");
  const [newBlogUrl, setNewBlogUrl] = useState("");
  const [message, setMessage] = useState(null);
  const [messageClass, setMessageClass] = useState(null);

  const blogsFormRef = useRef();

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogappUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  useEffect(() => {
    if (user === null) return;
    blogService.getAll().then((initialBlogs) => {
      setBlogs(initialBlogs);
    });
  }, [user]);

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const user = await loginService.login({
        username,
        password,
      });

      window.localStorage.setItem("loggedBlogappUser", JSON.stringify(user));

      blogService.setToken(user.token);
      setUser(user);
      setUsername("");
      setPassword("");
    } catch (exception) {
      setMessage("wrong username or password");
      setMessageClass("error");
      setTimeout(() => {
        setMessage(null);
      }, 5000);
    }
  };

  const blogsShow = () => {
    const sortedBlogs = blogs.sort((a, b) => {
      return b.likes - a.likes;
    });

    return (
      <>
        {sortedBlogs.map((blog) => (
          <Blog
            key={blog.id}
            blog={blog}
            blogService={blogService}
            removeBlog={removeBlog}
            user={user}
          />
        ))}
      </>
    );
  };

  const updateBlog = () => {
    blogService.update();
  };

  const logout = () => {
    window.localStorage.removeItem("loggedBlogappUser");
    setUser(null);
  };

  const addBlog = (blogObject) => {
    blogsFormRef.current.toggleVisibility();

    blogService.create(blogObject).then((returnedBlog) => {
      setBlogs(blogs.concat(returnedBlog));

      // console.log("Returned added object", returnedBlog);

      setMessage(`a new blog ${returnedBlog.title} by ${returnedBlog.author}`);
      setMessageClass("success");
      setTimeout(() => {
        setMessage(null);
      }, 5000);
    });
  };

  const removeBlog = (blogObject) => {
    // console.log("Removing blog...");
    if (
      window.confirm(`Remove blog ${blogObject.title} by ${blogObject.author}`)
    ) {
      blogService
        .deleteBlog(blogObject.id)
        .then(() => blogService.getAll())
        .then(setBlogs);
    }
  };

  return (
    <div>
      <Notification message={message} messageClass={messageClass} />
      {user === null ? (
        <LoginForm
          handleLogin={handleLogin}
          username={username}
          setUsername={setUsername}
          password={password}
          setPassword={setPassword}
        />
      ) : (
        <>
          <div>
            <h2>blogs</h2>
            <p>
              {user.name} logged-in <button onClick={logout}>logout</button>
            </p>
          </div>
          <div>
            <h2>create new</h2>
            <Togglable buttonLabel="create new blog" ref={blogsFormRef}>
              <BlogsForm createBlog={addBlog} />
            </Togglable>
          </div>
          {blogsShow()}
        </>
      )}
    </div>
  );
};

export default App;
