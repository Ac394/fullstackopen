import { useState } from "react";

const BlogsForm = ({ createBlog }) => {
  const [newBlogTitle, setNewBlogTitle] = useState("");
  const [newBlogAuthor, setNewBlogAuthor] = useState("");
  const [newBlogUrl, setNewBlogUrl] = useState("");

  const addBlog = (e) => {
    e.preventDefault();
    createBlog({
      title: newBlogTitle,
      author: newBlogAuthor,
      url: newBlogUrl,
    });

    setNewBlogTitle("");
    setNewBlogAuthor("");
    setNewBlogUrl("");
  };

  const handleNewBlogTitle = (e) => {
    setNewBlogTitle(e.target.value);
  };

  const handleNewBlogAuthor = (e) => {
    setNewBlogAuthor(e.target.value);
  };

  const handleNewBlogUrl = (e) => {
    setNewBlogUrl(e.target.value);
  };

  return (
    <>
      <form onSubmit={addBlog}>
        <label htmlFor="title">title</label>
        <input
          type="text"
          data-testid="title"
          name="title"
          id="title"
          value={newBlogTitle}
          onChange={handleNewBlogTitle}
          placeholder="Type the title here"
        />
        <br />
        <label htmlFor="author">author</label>
        <input
          type="text"
          data-testid="author"
          name="author"
          id="author"
          value={newBlogAuthor}
          onChange={handleNewBlogAuthor}
          placeholder="Type the author name here"
        />
        <br />
        <label htmlFor="url">url</label>
        <input
          type="text"
          data-testid="url"
          name="url"
          id="url"
          value={newBlogUrl}
          onChange={handleNewBlogUrl}
          placeholder="Type the url here"
        />
        <br />
        <button type="submit">create</button>
      </form>
    </>
  );
};

export default BlogsForm;
