/**
 * Extracts lines from a reader and delivers them as an async iterator.
 * @param {Reader} reader
 * @param {TextDecoder} decoder
 * @return {AsyncIterator<string>} extracted lines
 */
export async function* lineIterator(reader, decoder = new TextDecoder()) {
  let { value, done } = await reader.read();

  value = value ? decoder.decode(value) : "";

  const re = /\n|\r\n/gm;
  let startIndex = 0;

  for (;;) {
    const result = re.exec(value);
    if (result) {
      yield value.substring(startIndex, result.index);
      startIndex = re.lastIndex;
    }
    else {
      if (done) {
        break;
      }
      const remaining = value.substr(startIndex);
      ({ value, done } = await reader.read());

      value = value ? remaining + decoder.decode(value) : remaining;
      startIndex = re.lastIndex = 0;
    }
  }
  if (startIndex < value.length) {
    yield value.substr(startIndex);
  }
}
