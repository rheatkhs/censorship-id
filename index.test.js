const { censorId } = require(".");

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
        expect(output).toContain("******");
        expect(output).toContain("*****");
        expect(output.toLowerCase()).not.toContain("anjing");
        expect(output.toLowerCase()).not.toContain("berak");
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
        expect(output).toContain("Pantai");
        expect(output).toContain("***");
        expect(output).not.toContain(" tai ");
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
});
