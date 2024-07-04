import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import BlogsForm from "./BlogsForm";

test("<BlogsForm /> receives the right details when a new blog is created", async () => {
  const createBlog = vi.fn();
  const user = userEvent.setup();

  render(<BlogsForm createBlog={createBlog} />);

  const inputTitle = screen.getByPlaceholderText("Type the title here");
  const inputAuthor = screen.getByPlaceholderText("Type the author name here");
  const inputUrl = screen.getByPlaceholderText("Type the url here");
  const sendButton = screen.getByText("create");

  await user.type(inputTitle, "randomtitle");
  await user.type(inputAuthor, "randomauthor");
  await user.type(inputUrl, "randomurl");
  await user.click(sendButton);

  expect(createBlog.mock.calls).toHaveLength(1);
  expect(createBlog.mock.calls[0][0].title).toBe("randomtitle");
  expect(createBlog.mock.calls[0][0].author).toBe("randomauthor");
  expect(createBlog.mock.calls[0][0].url).toBe("randomurl");
});
