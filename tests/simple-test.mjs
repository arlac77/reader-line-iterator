import test from "ava";
import { lineIterator } from "reader-line-iterator";

class Reader {
  constructor(chunks)
  {
     this.chunks = chunks;
  }

  async * read()
  {
     for(const chunk of this.chunks) {
       yield { value: chunk, done: false};
     }
     yield { value: undefined, done: true };
  }
}

test("1st.", async t => {
  const reader = new Reader([""]);
  const lines = [];

  for await (const line of lineIterator(reader)) {
    lines.push(line);
  }

  t.deepEqual(lines,[]);
}); 
