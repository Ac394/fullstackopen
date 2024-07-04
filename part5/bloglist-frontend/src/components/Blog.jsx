import { useState } from "react";

const Blog = ({ blog, blogService, removeBlog, user, addLikeTest }) => {
  const [blogObject, setBlogObject] = useState(blog);
  const [detailsVisible, setDetailsVisible] = useState(false);

  const toggleDetailsVisibility = () => {
    setDetailsVisible(!detailsVisible);
  };

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  const addLike = () => {
    const updatedBlog = {
      ...blogObject,
      likes: blogObject.likes + 1,
    };
    blogService.update(updatedBlog.id, updatedBlog);
    setBlogObject(updatedBlog);
  };

  return (
    <div style={blogStyle} className="blog">
      {blogObject.title} {blogObject.author}
      <button onClick={toggleDetailsVisibility}>view</button>
      {detailsVisible && (
        <>
          <br />
          {blogObject.url}
          <br />
          likes {blogObject.likes}
          <button onClick={() => (addLikeTest ? addLikeTest() : addLike())}>
            like
          </button>
          <br />
          {blogObject.author}
          <br />
          {blog.user?.username === user?.username && (
            <button
              onClick={() => {
                removeBlog(blogObject);
              }}
            >
              remove
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default Blog;
