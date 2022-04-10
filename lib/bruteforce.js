import Bruteforcer from "bruteforcer";
import md5 from "md5";

export default function bruteforce(puzzle, charSet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789", length = 3) {
  return new Promise((resolve, reject) => {
    const bf = new Bruteforcer({
      chars: charSet,
      min: length,
      max: length,
      cbk: (str) => {
        const hash = md5(str);
        if (hash === puzzle) {
          bf.stop();
          return resolve(str);
        }
      }
    });

    bf.start();
  });
}