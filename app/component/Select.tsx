"use client";
import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type FocusEvent,
  type KeyboardEvent,
} from "react";
import { createPortal } from "react-dom";

export type SelectOption = { value: string; label: string };

type Props = {
  id?: string;
  name?: string;
  value: string;
  options: readonly SelectOption[];
  onChange: (value: string) => void;
  placeholder?: string;
  labelledBy?: string;
  className?: string;
};

const GAP = 8;
const MAX_HEIGHT = 256;

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      aria-hidden="true"
      className={`h-4 w-4 shrink-0 transition-transform duration-200 ${
        open ? "rotate-180" : ""
      }`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-4 w-4 shrink-0"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export default function Select({
  id,
  name,
  value,
  options,
  onChange,
  placeholder = "Select an option",
  labelledBy,
  className = "",
}: Props) {
  const generatedId = useId();
  const buttonId = id ?? `${generatedId}-button`;
  const listId = `${generatedId}-list`;
  const valueId = `${generatedId}-value`;
  const optionId = (index: number) => `${generatedId}-option-${index}`;

  const buttonRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [position, setPosition] = useState<CSSProperties>({});

  const selectedIndex = options.findIndex((option) => option.value === value);
  const selected = options[selectedIndex];

  const updatePosition = useCallback(() => {
    const button = buttonRef.current;
    if (!button) return;
    const rect = button.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom - GAP;
    const spaceAbove = rect.top - GAP;
    const openUp = spaceBelow < 160 && spaceAbove > spaceBelow;
    const room = openUp ? spaceAbove : spaceBelow;
    const maxHeight = Math.max(Math.min(MAX_HEIGHT, room - GAP), 120);

    setPosition({
      position: "fixed",
      left: rect.left,
      width: rect.width,
      maxHeight,
      ...(openUp
        ? { bottom: window.innerHeight - rect.top + GAP }
        : { top: rect.bottom + GAP }),
    });
  }, []);

  const openList = (index = selectedIndex >= 0 ? selectedIndex : 0) => {
    updatePosition();
    setActiveIndex(index);
    setOpen(true);
  };

  const closeList = (focusButton = true) => {
    setOpen(false);
    if (focusButton) buttonRef.current?.focus();
  };

  const choose = (index: number) => {
    const option = options[index];
    if (option && option.value !== value) onChange(option.value);
    closeList();
  };

  useLayoutEffect(() => {
    if (open) listRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [open, updatePosition]);

  useEffect(() => {
    if (!open || activeIndex < 0) return;
    document
      .getElementById(optionId(activeIndex))
      ?.scrollIntoView?.({ block: "nearest" });
  });

  const handleButtonKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (["ArrowDown", "ArrowUp", "Enter", " "].includes(e.key)) {
      e.preventDefault();
      if (e.key === "ArrowUp") {
        openList(selectedIndex >= 0 ? selectedIndex : options.length - 1);
      } else {
        openList();
      }
    }
  };

  const findByLetter = (letter: string) => {
    const lower = letter.toLowerCase();
    const count = options.length;
    for (let step = 1; step <= count; step++) {
      const index = (activeIndex + step) % count;
      if (options[index].label.toLowerCase().startsWith(lower)) return index;
    }
    return -1;
  };

  const handleListKeyDown = (e: KeyboardEvent<HTMLUListElement>) => {
    const last = options.length - 1;
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActiveIndex((index) => Math.min(index + 1, last));
        break;
      case "ArrowUp":
        e.preventDefault();
        setActiveIndex((index) => Math.max(index - 1, 0));
        break;
      case "Home":
        e.preventDefault();
        setActiveIndex(0);
        break;
      case "End":
        e.preventDefault();
        setActiveIndex(last);
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        choose(activeIndex);
        break;
      case "Escape":
        e.preventDefault();
        closeList();
        break;
      case "Tab":
        closeList(false);
        break;
      default:
        if (e.key.length === 1 && /\S/.test(e.key)) {
          const match = findByLetter(e.key);
          if (match >= 0) setActiveIndex(match);
        }
    }
  };

  const handleListBlur = (e: FocusEvent<HTMLUListElement>) => {
    const next = e.relatedTarget as Node | null;
    const staysInside =
      next &&
      (buttonRef.current?.contains(next) || listRef.current?.contains(next));
    if (!staysInside) setOpen(false);
  };

  const list = open ? (
    <ul
      ref={listRef}
      id={listId}
      role="listbox"
      tabIndex={-1}
      aria-labelledby={labelledBy ?? buttonId}
      aria-activedescendant={activeIndex >= 0 ? optionId(activeIndex) : undefined}
      onKeyDown={handleListKeyDown}
      onBlur={handleListBlur}
      style={position}
      className="z-50 overflow-y-auto rounded-xl border p-1.5 shadow-xl outline-none animate-dropdown border-gray-200 bg-white shadow-black/10 dark:border-gray-600 dark:bg-gray-800 dark:shadow-black/40"
    >
      {options.map((option, index) => {
        const isSelected = index === selectedIndex;
        const isActive = index === activeIndex;
        return (
          <li
            key={option.value}
            id={optionId(index)}
            role="option"
            aria-selected={isSelected}
            onMouseDown={(e) => e.preventDefault()}
            onMouseEnter={() => setActiveIndex(index)}
            onClick={() => choose(index)}
            className={`flex cursor-pointer items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
              isActive
                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-200"
                : "text-gray-700 dark:text-gray-200"
            } ${isSelected ? "font-semibold" : ""}`}
          >
            <span className="truncate">{option.label}</span>
            {isSelected && (
              <span className="text-emerald-500 dark:text-emerald-400">
                <CheckIcon />
              </span>
            )}
          </li>
        );
      })}
    </ul>
  ) : null;

  return (
    <>
      <button
        ref={buttonRef}
        id={buttonId}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        aria-labelledby={labelledBy ? `${labelledBy} ${valueId}` : undefined}
        onMouseDown={(e) => {
          if (open) e.preventDefault();
        }}
        onClick={() => (open ? closeList() : openList())}
        onKeyDown={handleButtonKeyDown}
        className={`flex w-full cursor-pointer items-center justify-between gap-3 text-left outline-none transition-all duration-200 focus-visible:ring-4 focus-visible:ring-emerald-200 dark:focus-visible:ring-emerald-900 ${
          open ? "ring-4 ring-emerald-200 dark:ring-emerald-900" : ""
        } ${className}`}
      >
        <span
          id={valueId}
          className={`truncate ${
            selected ? "" : "text-gray-500 dark:text-gray-400"
          }`}
        >
          {selected ? selected.label : placeholder}
        </span>
        <span className="text-gray-500 dark:text-gray-400">
          <ChevronIcon open={open} />
        </span>
      </button>
      {name && <input type="hidden" name={name} value={value} />}
      {list && createPortal(list, document.body)}
    </>
  );
}
