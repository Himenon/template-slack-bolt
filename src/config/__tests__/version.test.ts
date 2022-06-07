import { expect, test } from "vitest";

import { VERSION } from "../version";

test("Version Test", () => {
  expect(VERSION).toEqual("development");
});
