import { vsprintf } from 'sprintf-js';

type ComboMessage = string | string[];

// TODO: fix eslint enum
enum Level { // eslint-disable-line no-shadow, no-unused-vars
  INFO = 'info', // eslint-disable-line no-unused-vars
}

const PROGRESS_SYMBOL = '...';

class CliLogger {
  public info(message, ...args: string[]) {
    this.dummy([message, ...args], Level.INFO);
  }

  public infoPrint(message, ...args: string[]) {
    this.dummy([message, ...args], Level.INFO, true);
  }

  public infoProgress(message: ComboMessage, action: () => void) {
    const
      [messageStr, ...args] = Array.isArray(message) ? message : [message, []],
      [prefix, suffix] = messageStr.split(PROGRESS_SYMBOL);

    // @ts-ignore: TODO
    this.infoPrint(`${prefix}${PROGRESS_SYMBOL}`, ...args);
    action();
    this.println(suffix);
  }

  public print(message: string) {
    process.stdout.write(message);
  }

  public println(message: string) {
    this.print(`${message}\n`);
  }

  private dummy(input: string[], level: Level, write: boolean = false) {
    if (process.env.LIBJ_SKIP_TEST_LOG) {
      return;
    }

    const
      [message, ...args] = input,
      msg = vsprintf(`[cli] ${level}: ${message}`, args);

    if (write) {
      this.print(msg);
    } else {
      console[level](msg);
    }
  }
}

let singleton;

export const cliLogger = () => {
  if (singleton) {
    return singleton;
  }
  return (singleton = new CliLogger()); // eslint-disable-line no-return-assign
};
