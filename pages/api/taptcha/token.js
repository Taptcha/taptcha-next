import path from "path";
import getConfig from "next/config";
const { serverRuntimeConfig } = getConfig();
import randomString from "../../../lib/randomString";
import ttl from "../../../lib/ttl";

export default function generateToken(req, res) {
  const puzzleCache = ttl(path.join(serverRuntimeConfig.root, "./lib/store/puzzleObject.json"));
  const tokenCache = ttl(path.join(serverRuntimeConfig.root, "./lib/store/tokenObject.json"));

  const { puzzle, answer } = req.query;

  if (!puzzle || !answer) return res.json({ err: "NO_PUZZLE_OR_ANSWER" });

  if (puzzleCache.get(puzzle) === answer) {
    const token = randomString(32);
    tokenCache.set(token, true, { ttl: 120 });

    res.json({ passed: true, token });
  } else {
    res.json({ passed: false });
  }
}