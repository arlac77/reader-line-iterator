import test from "ava";
import { lineIterator } from "reader-line-iterator";

test("1st.", async t => {
  const reader = new Reader();
  for await (const line of lineIterator(reader)) {
    console.log(line);
  }

}); 
