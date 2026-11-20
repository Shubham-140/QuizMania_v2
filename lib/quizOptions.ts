export const categories = [
  { value: "general_knowledge", label: "General Knowledge" },
  { value: "film", label: "Movies & Film" },
  { value: "music", label: "Music" },
  { value: "science", label: "Science" },
  { value: "arts_and_literature", label: "Arts & Literature" },
  { value: "history", label: "History" },
  { value: "geography", label: "Geography" },
  { value: "society_and_culture", label: "Society & Culture" },
  { value: "food_and_drink", label: "Food & Drink" },
  { value: "sports", label: "Sports" },
] as const;

export const difficulties = ["easy", "medium", "hard"] as const;

export const NO_TIME_LIMIT = 999999;
