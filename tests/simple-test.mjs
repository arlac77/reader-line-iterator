import test from "ava";
import { lineIterator } from "reader-line-iterator";

class Reader {
  constructor(chunks) {
    this.te = new TextEncoder();
    this.chunks = chunks;
    this.index = 0;
  }

  async read() {
    return this.index < this.chunks.length
      ? {
          done: false,
          value: this.te.encode(this.chunks[this.index++])
        }
      : { value: undefined, done: true };
  }
}

async function rt(t, te, chunks, lines) {
  const reader = new Reader(chunks);
  const got = [];

  for await (const line of lineIterator(reader, te)) {
    got.push(line);
  }
  t.deepEqual(got, lines);
}

rt.title = (providedTitle = "", te, chunks, lines) =>
  `equal ${providedTitle} ${chunks} ${lines}`.trim();

test(rt, undefined, [], []);
test(rt, undefined, ["line 1"], ["line 1"]);
test(rt, undefined, ["li", "ne 1\nline", " ", "2"], ["line 1", "line 2"]);
test(rt, undefined, ["line 1\n\nline 2"], ["line 1", "", "line 2"]);
test(rt, new TextDecoder("iso-8859-2"), ["te line 1\n\nte line 2"], ["te line 1", "", "te line 2"]);
