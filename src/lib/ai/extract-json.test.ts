import { describe, expect, it } from "vitest";
import { extractJsonValue } from "./extract-json";

describe("extractJsonValue", () => {
  it("parses a plain JSON object", () => {
    const v = extractJsonValue('{"a":1,"b":"two"}');
    expect(v).toEqual({ a: 1, b: "two" });
  });

  it("strips markdown json fences", () => {
    const raw = "```json\n{\"x\": true}\n```";
    const v = extractJsonValue(raw);
    expect(v).toEqual({ x: true });
  });

  it("extracts first object when there is leading prose", () => {
    const raw = 'Here you go:\n{"ok": false, "n": 3}\nThanks.';
    const v = extractJsonValue(raw);
    expect(v).toEqual({ ok: false, n: 3 });
  });

  it("does not treat braces inside string values as object boundaries", () => {
    const raw = 'Prefix {"msg": "has { brace inside", "n": 1} trailer';
    const v = extractJsonValue(raw);
    expect(v).toEqual({ msg: "has { brace inside", n: 1 });
  });

  it("returns null for non-JSON", () => {
    expect(extractJsonValue("no braces here")).toBeNull();
  });
});
