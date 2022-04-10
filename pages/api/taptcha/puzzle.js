import path from "path";
import getConfig from "next/config";
const { serverRuntimeConfig } = getConfig();
import ttl from "../../../lib/ttl";
import randomString from "../../../lib/randomString";
import md5 from "md5";

export default function generatePuzzle(req, res) {
  const puzzleCache = ttl(path.join(serverRuntimeConfig.root, "./lib/store/puzzleObject.json"));
  const answer = randomString(3);
  const puzzle = md5(answer);
  puzzleCache.set(puzzle, answer, { ttl: 60 });

  res.json({ puzzle });
}