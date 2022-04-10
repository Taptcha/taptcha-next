import path from "path";
import getConfig from "next/config";
const { serverRuntimeConfig } = getConfig();
import ttl from "../../../lib/ttl";

export default function verifyToken(req, res) {
  const { token } = req.query;

  if (!token) return res.json({ err: "NO_TOKEN" });

  const tokenCache = ttl(path.join(serverRuntimeConfig.root, "./lib/store/tokenObject.json"));

  if (tokenCache.get(token)) {
    tokenCache.delete(token);
    res.json({ passed: true });
  } else {
    res.json({ passed: false });
  }
}