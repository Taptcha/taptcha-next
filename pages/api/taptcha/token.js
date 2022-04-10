import puzzleObject from "../../../lib/store/puzzleObject";
import tokenObject from "../../../lib/store/tokenObject";
import randomString from "../../../lib/randomString";
import ttl from "../../../lib/ttl";

export default function generateToken(req, res) {
  const puzzleCache = ttl(puzzleObject);
  const tokenCache = ttl(tokenObject);

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