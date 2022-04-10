import puzzleObject from "../../../lib/store/puzzleObject";
import randomString from"../../../lib/randomString";
import ttl from "../../../lib/ttl";
import md5 from "md5";

export default function generatePuzzle(req, res) {
  const puzzleCache = ttl(puzzleObject);
  const answer = randomString(3);
  const puzzle = md5(answer);
  puzzleCache.set(puzzle, answer, { ttl: 60 });

  res.json({ puzzle });
}