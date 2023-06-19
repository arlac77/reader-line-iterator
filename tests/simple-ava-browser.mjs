import test from "ava";
import { lineIterator } from "reader-line-iterator";

async function rt(t, te, chunks, lines) {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      for (const chunk of chunks) {
        controller.enqueue(encoder.encode(chunk));
      }

      controller.close();
    }
  });

  const got = [];

  for await (const line of lineIterator(stream.getReader(), te)) {
    got.push(line);
  }
  t.deepEqual(got, lines);
}

rt.title = (providedTitle = "", te, chunks, lines) =>
  `equal ${providedTitle} ${chunks} ${lines}`.trim();

test(rt, undefined, [], []);
test(rt, undefined, ["line 1"], ["line 1"]);
test(rt, undefined, ["li", "ne 1\r\nline", " ", "2"], ["line 1", "line 2"]);
test(rt, undefined, ["line 1\n\nline 2"], ["line 1", "", "line 2"]);
test(
  rt,
  new TextDecoder("iso-8859-2"),
  ["te line 1\n\nte line 2"],
  ["te line 1", "", "te line 2"]
);
