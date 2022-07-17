/**
 * Extracts lines from a reader and delivers them as an async iterator.
 * @param {Reader} reader
 * @param {TextDecoder} decoder
 * @return {AsyncIterator<string>} extracted lines
 */
export async function* lineIterator(reader, decoder = new TextDecoder()) {
  let r = await reader.read();

  let chunk = r.value ? decoder.decode(r.value) : "";

  const re = /\n|\r\n/gm;
  let startIndex = 0;

  for (;;) {
    const result = re.exec(chunk);
    if (result) {
      yield chunk.substring(startIndex, result.index);
      startIndex = re.lastIndex;
    }
    else {
      if (r.done) {
        break;
      }
      const remaining = chunk.substring(startIndex);
      r = await reader.read();

      chunk = r.value ? remaining + decoder.decode(r.value) : remaining;
      startIndex = re.lastIndex = 0;
    }
  }
  if (startIndex < chunk.length) {
    yield chunk.substring(startIndex);
  }
}
