/**
 * Extracts lines from a reader and delivers them as an async iterator.
 * @param {Reader} reader
 * @param {TextDecoder} decoder
 * @return {AsyncIterator<string>} lines
 */
export async function* lineIterator(reader, decoder = new TextDecoder()) {
  let { value, done } = await reader.read();

  if (done) {
    return;
  }

  value = value ? decoder.decode(value) : "";

  const re = /\n|\r\n/gm;
  let startIndex = 0;

  for (;;) {
    const result = re.exec(value);
    if (!result) {
      if (done) {
        break;
      }
      const remainder = value.substr(startIndex);
      ({ value, done } = await reader.read());

      value = value ? remainder + decoder.decode(value) : remainder;
      startIndex = re.lastIndex = 0;
      continue;
    }
    yield value.substring(startIndex, result.index);
    startIndex = re.lastIndex;
  }
  if (startIndex < value.length) {
    yield value.substr(startIndex);
  }
}
