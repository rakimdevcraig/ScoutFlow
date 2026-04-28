/**
 * Strip ``` / ```json fences, then extract the first top-level JSON object.
 * Uses a string-aware brace scan so `{` inside string values does not break depth.
 */

function stripMarkdownFences(text: string): string {
  let s = text.trim();
  const fence = /^```(?:json)?\s*\n?/i;
  if (fence.test(s)) {
    s = s.replace(fence, "");
  }
  s = s.replace(/\n?```\s*$/i, "");
  return s.trim();
}

/**
 * Slice from first `{` through the matching closing `}` (JSON uses " strings only).
 */
function sliceFirstBalancedObject(text: string): string | null {
  const start = text.indexOf("{");
  if (start === -1) return null;

  let depth = 0;
  let inString = false;
  let escape = false;

  for (let i = start; i < text.length; i++) {
    const c = text[i];

    if (escape) {
      escape = false;
      continue;
    }

    if (inString) {
      if (c === "\\") {
        escape = true;
        continue;
      }
      if (c === '"') {
        inString = false;
      }
      continue;
    }

    if (c === '"') {
      inString = true;
      continue;
    }

    if (c === "{") {
      depth++;
    } else if (c === "}") {
      depth--;
      if (depth === 0) {
        return text.slice(start, i + 1);
      }
    }
  }

  return null;
}

/**
 * Returns parsed JSON value or null (never throws).
 */
export function extractJsonValue(raw: string): unknown | null {
  const stripped = stripMarkdownFences(raw);

  const tryParse = (s: string): unknown | null => {
    try {
      return JSON.parse(s) as unknown;
    } catch {
      return null;
    }
  };

  const direct = tryParse(stripped);
  if (
    direct !== null &&
    typeof direct === "object" &&
    !Array.isArray(direct)
  ) {
    return direct;
  }

  const slice = sliceFirstBalancedObject(stripped);
  if (!slice) return null;

  return tryParse(slice);
}
