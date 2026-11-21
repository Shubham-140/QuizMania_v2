import { describe, expect, it, vi } from "vitest";
import { useState } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Select from "./Select";

const options = [
  { value: "film", label: "Movies & Film" },
  { value: "music", label: "Music" },
  { value: "science", label: "Science" },
  { value: "sports", label: "Sports" },
];

function Harness({
  onChange = vi.fn(),
  initial = "",
}: {
  onChange?: (value: string) => void;
  initial?: string;
}) {
  const [value, setValue] = useState(initial);
  return (
    <form aria-label="quiz">
      <label id="category-label" htmlFor="category">
        Category
      </label>
      <Select
        id="category"
        labelledBy="category-label"
        name="category"
        value={value}
        options={options}
        onChange={(next) => {
          setValue(next);
          onChange(next);
        }}
        placeholder="Select a category"
      />
      <button type="button">Outside</button>
    </form>
  );
}

const trigger = () => screen.getByRole("button", { name: /category/i });

describe("Select", () => {
  it("shows the placeholder and is labelled by its label", () => {
    render(<Harness />);

    expect(trigger()).toHaveAccessibleName("Category Select a category");

    expect(trigger()).toHaveTextContent("Select a category");
    expect(trigger()).toHaveAttribute("aria-haspopup", "listbox");
    expect(trigger()).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("opens on click and picks an option with the mouse", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Harness onChange={onChange} />);

    await user.click(trigger());
    expect(trigger()).toHaveAttribute("aria-expanded", "true");
    await user.click(screen.getByRole("option", { name: "Science" }));

    expect(onChange).toHaveBeenCalledWith("science");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    expect(trigger()).toHaveTextContent("Science");
    expect(trigger()).toHaveFocus();
  });

  it("can be used with the keyboard alone", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Harness onChange={onChange} />);

    await user.tab();
    expect(trigger()).toHaveFocus();
    await user.keyboard("{ArrowDown}");

    const listbox = screen.getByRole("listbox");
    expect(listbox).toHaveFocus();
    const activeName = () =>
      document.getElementById(
        listbox.getAttribute("aria-activedescendant") ?? ""
      )?.textContent;
    expect(activeName()).toBe("Movies & Film");

    await user.keyboard("{ArrowDown}{ArrowDown}");
    expect(activeName()).toBe("Science");
    await user.keyboard("{End}");
    expect(activeName()).toBe("Sports");
    await user.keyboard("{Home}");
    expect(activeName()).toBe("Movies & Film");
    await user.keyboard("m");
    expect(activeName()).toBe("Music");

    await user.keyboard("{Enter}");
    expect(onChange).toHaveBeenCalledWith("music");
    expect(trigger()).toHaveFocus();
    expect(trigger()).toHaveTextContent("Music");
  });

  it("marks the current value as selected when it opens", async () => {
    const user = userEvent.setup();
    render(<Harness initial="sports" />);

    await user.click(trigger());

    expect(screen.getByRole("option", { name: "Sports" })).toHaveAttribute(
      "aria-selected",
      "true"
    );
    expect(screen.getByRole("option", { name: "Music" })).toHaveAttribute(
      "aria-selected",
      "false"
    );
  });

  it("closes without changing the value on Escape or a click outside", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Harness onChange={onChange} initial="film" />);

    await user.click(trigger());
    await user.keyboard("{ArrowDown}{Escape}");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    expect(trigger()).toHaveFocus();

    await user.click(trigger());
    await user.click(screen.getByRole("button", { name: "Outside" }));
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();

    expect(onChange).not.toHaveBeenCalled();
    expect(trigger()).toHaveTextContent("Movies & Film");
  });

  it("sends the chosen value with the form", async () => {
    const user = userEvent.setup();
    render(<Harness />);

    await user.click(trigger());
    await user.click(screen.getByRole("option", { name: "Music" }));

    const form = screen.getByRole("form", { name: "quiz" }) as HTMLFormElement;
    expect(new FormData(form).get("category")).toBe("music");
  });
});
