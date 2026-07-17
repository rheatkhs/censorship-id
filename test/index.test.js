const {
  censorId,
  detect,
  isProfane,
  addWords,
  removeWords,
  getDictionary,
  dictionary,
} = require("..");

describe("censorId", () => {
  test("censors default profanity", () => {
    const input = "Dasar anjing kau, babi!";
    const output = censorId(input);
    expect(output).toContain("******");
    expect(output).toContain("****");
    expect(output).not.toContain("anjing");
    expect(output).not.toContain("babi");
  });

  test("is case-insensitive", () => {
    const input = "ANJING itu sedang berak di jalan.";
    const output = censorId(input);
    expect(output).toBe("****** itu sedang ***** di jalan.");
  });

  test("handles customWords option", () => {
    const input = "Kamu sangat malas!";
    const output = censorId(input, { customWords: ["malas"] });
    expect(output).toBe("Kamu sangat *****!");
  });

  test("handles custom mask option", () => {
    const input = "Anjing!";
    const output = censorId(input, { mask: "#" });
    expect(output).toBe("######!");
  });

  test("handles keepFirstAndLast option", () => {
    const input = "Anjing!";
    const output = censorId(input, { keepFirstAndLast: true });
    expect(output).toBe("A****g!");
  });

  test("avoids accidental censoring (word boundaries)", () => {
    const input = "Pantai itu indah, tapi ada tai di pasir.";
    const output = censorId(input);
    expect(output).toBe("Pantai itu indah, tapi ada *** di pasir.");
  });

  test("handles empty strings and non-string input", () => {
    expect(censorId("")).toBe("");
    expect(censorId(null)).toBe(null);
    expect(censorId(123)).toBe(123);
  });

  test("handles special characters and mixed case in custom words", () => {
    const input = "Jangan @#$%^ kamu!";
    const output = censorId(input, { customWords: ["@#$%^"] });
    expect(output).toBe("Jangan ***** kamu!");
  });

  test("handles leetspeak in smartMode", () => {
    const input = "Dasar 4njing, 8481 kau!";
    const output = censorId(input, { smartMode: true });
    expect(output).toMatch(/Dasar \*+, \*+ kau!/);
  });

  test("handles repeated characters in smartMode", () => {
    const input = "Peeeeeereeeeeeek lo!";
    const output = censorId(input, { smartMode: true });
    expect(output).toMatch(/^\*+ lo!$/);
  });

  test("handles punctuation inside words in smartMode", () => {
    const input = "Dasar a.n.j.i.n.g!";
    const output = censorId(input, { smartMode: true });
    expect(output).toBe("Dasar " + "*".repeat(11) + "!");
  });

  test("smartMode works with keepFirstAndLast", () => {
    const input = "4njing!";
    const output = censorId(input, { smartMode: true, keepFirstAndLast: true });
    expect(output).toBe("4****g!");
  });

  test("allowedWords prevents censoring whitelisted words", () => {
    const input = "Buaya itu makan di sungai.";
    const output = censorId(input, { allowedWords: ["buaya"] });
    expect(output).toBe("Buaya itu makan di sungai.");
  });

  test("allowedWords is case-insensitive", () => {
    const input = "BUAYA adalah hewan.";
    const output = censorId(input, { allowedWords: ["buaya"] });
    expect(output).toBe("BUAYA adalah hewan.");
  });

  test("allowedWords still censors non-whitelisted words", () => {
    const input = "Anjing itu buaya!";
    const output = censorId(input, { allowedWords: ["buaya"] });
    expect(output).toBe("****** itu buaya!");
  });

  test("allowedWords with empty list censors everything normally", () => {
    const input = "Anjing babi!";
    const output = censorId(input, { allowedWords: [] });
    expect(output).toBe("****** ****!");
  });

  test("minSeverity filters out lower-severity words", () => {
    const input = "Anjing itu tai!"; // anjing=high, tai=medium
    const output = censorId(input, { minSeverity: "high" });
    expect(output).toBe("****** itu tai!");
  });

  test("categories option only censors matching categories", () => {
    const input = "Anjing tai kontol!"; // offensive, vulgar, sexual
    const output = censorId(input, { categories: ["sexual"] });
    expect(output).toBe("Anjing tai ******!");
  });
});

describe("detect", () => {
  test("returns structured matches with metadata", () => {
    const input = "Dasar anjing kau, babi!";
    const results = detect(input);
    expect(results.length).toBe(2);
    expect(results[0]).toHaveProperty("word", "anjing");
    expect(results[0]).toHaveProperty("match", "anjing");
    expect(results[0]).toHaveProperty("index", 6);
    expect(results[0]).toHaveProperty("length", 6);
    expect(results[0]).toHaveProperty("severity");
    expect(results[0]).toHaveProperty("category");
  });

  test("returns empty array for clean text", () => {
    expect(detect("Halo apa kabar?")).toEqual([]);
  });

  test("returns empty array for non-string input", () => {
    expect(detect(null)).toEqual([]);
  });

  test("smartMode returns normalized word in word field", () => {
    const input = "Dasar 4njing kau!";
    const results = detect(input, { smartMode: true });
    expect(results.length).toBe(1);
    expect(results[0].match).toBe("4njing");
    expect(results[0].word).toBe("anjing");
  });

  test("unique option only returns first occurrence", () => {
    const input = "anjing anjing anjing";
    const results = detect(input, { unique: true });
    expect(results.length).toBe(1);
  });

  test("minSeverity filters results by severity", () => {
    const input = "anjing tai kontol"; // high, medium, high
    const results = detect(input, { minSeverity: "high" });
    const words = results.map((r) => r.word);
    expect(words).toContain("anjing");
    expect(words).toContain("kontol");
    expect(words).not.toContain("tai");
  });

  test("categories filters results by category", () => {
    const input = "anjing babi"; // both offensive
    const results = detect(input, { categories: ["slur"] });
    expect(results.length).toBe(0);
  });
});

describe("isProfane", () => {
  test("returns true when profanity present", () => {
    expect(isProfane("Dasar anjing!")).toBe(true);
  });

  test("returns false for clean text", () => {
    expect(isProfane("Halo apa kabar?")).toBe(false);
  });

  test("respects minSeverity option", () => {
    // tai is medium, so with minSeverity high it should be false
    expect(isProfane("ada tai di sini", { minSeverity: "high" })).toBe(false);
  });
});

describe("dictionary management", () => {
  afterEach(() => {
    // restore original state if modified
  });

  test("addWords adds a new word", () => {
    const before = getDictionary().length;
    addWords(["perkosa"]);
    const after = getDictionary().length;
    expect(after).toBe(before + 1);
    removeWords(["perkosa"]);
  });

  test("removeWords removes a word", () => {
    const before = getDictionary().length;
    addWords(["bodoh"]);
    expect(getDictionary().length).toBe(before + 1);
    removeWords(["bodoh"]);
    expect(getDictionary().length).toBe(before);
  });

  test("addWords with custom severity and category", () => {
    addWords([{ word: "jelek", severity: "low", category: "vulgar" }]);
    const dict = getDictionary();
    const entry = dict.find((e) => e.word === "jelek");
    expect(entry).toBeDefined();
    expect(entry.severity).toBe("low");
    expect(entry.category).toBe("vulgar");
    removeWords(["jelek"]);
  });

  test("dictionary exports structured entries", () => {
    expect(Array.isArray(dictionary)).toBe(true);
    expect(dictionary[0]).toHaveProperty("word");
    expect(dictionary[0]).toHaveProperty("severity");
    expect(dictionary[0]).toHaveProperty("category");
  });
});
