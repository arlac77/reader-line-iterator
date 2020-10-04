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

async function rt(t, chunks, lines) {
  const reader = new Reader(chunks);
  const got = [];

  for await (const line of lineIterator(reader)) {
    got.push(line);
  }
  t.deepEqual(got, lines);
}

rt.title = (providedTitle = "", chunks, lines) =>
  `equal ${providedTitle} ${chunks} ${lines}`.trim();

test(rt, [], []);
test(rt, ["line 1"], ["line 1"]);
test(rt, ["li", "ne 1\nline", " ", "2"], ["line 1", "line 2"]);
test(rt, ["line 1\n\nline 2"], ["line 1", "", "line 2"]);
