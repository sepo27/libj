interface Options {
  length?: number
}

const DefaultOptions: Options = {
  length: 10,
}

const LOREM_IPSUM_TEXT = `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`

export const slackTextGen = (options: Options = {}): string => {
  const opts = { ...DefaultOptions, ...options };

  let text = LOREM_IPSUM_TEXT;

  if (text.length > opts.length) {
    text = text.substr(0, opts.length);
  } else if (text.length < opts.length) {
    // Generate required length
    text += '\n';

    while (text.length < opts.length) {
      text += LOREM_IPSUM_TEXT.substr(0, Math.min(LOREM_IPSUM_TEXT.length, opts.length - text.length));
    }
  }

  return text;
};
