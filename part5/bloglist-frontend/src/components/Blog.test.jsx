import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Blog from "./Blog";

describe("Blog", () => {
  const blog = {
    title: "Yesa",
    author: "Noa",
    url: "yesno.com",
    likes: 0,
  };

  let container;
  let mockHandler;

  beforeEach(() => {
    mockHandler = vi.fn();
    container = render(
      <Blog blog={blog} addLikeTest={mockHandler} />
    ).container;
  });

  test("renders title & author", () => {
    // Expect to be rendered
    const div = container.querySelector(".blog");
    expect(div).toHaveTextContent("Yesa");
    expect(div).toHaveTextContent("Noa");

    // Expect to be hidden
    const url = screen.queryByText("yesno.com");
    const likes = screen.queryByText("0");
    expect(url).toBeNull();
    expect(likes).toBeNull();
  });

  test("clicking the button renders url & likes", async () => {
    const user = userEvent.setup();
    const button = screen.getByText("view");
    await user.click(button);

    const div = container.querySelector(".blog");
    expect(div).toHaveTextContent("yesno.com");
    expect(div).toHaveTextContent("0");
  });

  test("clicking the add like button twice runs the function two times", async () => {
    const user = userEvent.setup();
    const buttonView = screen.getByText("view");
    await user.click(buttonView);

    const buttonLike = screen.getByText("like");
    await user.click(buttonLike);
    await user.click(buttonLike);

    expect(mockHandler.mock.calls).toHaveLength(2);
  });
});
