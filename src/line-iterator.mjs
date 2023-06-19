/**
 * Extracts lines from a reader and delivers them as an async iterator.
 * @param {ReadableStreamDefaultReader|ReadableStreamBYOBReader} reader
 * @param {TextDecoder} decoder
 * @return {AsyncIterator<string>} extracted lines
 */
export async function* lineIterator(reader, decoder = new TextDecoder()) {
  const re = /\r?\n/gm;
  let chunk = "";
  let startIndex = 0;
  for (;;) {
    const result = re.exec(chunk);
    if (result) {
      yield chunk.substring(startIndex, result.index);
      startIndex = re.lastIndex;
    } else {
      chunk = chunk.substring(startIndex);
      startIndex = re.lastIndex = 0;
      const r = await reader.read();
      if (r.done) {
        break;
      }
      chunk += decoder.decode(r.value);
    }
  }
  if (startIndex < chunk.length) {
    yield chunk;
  }
}
