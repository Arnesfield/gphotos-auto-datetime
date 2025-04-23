var adt = (function () {
  'use strict';

  const NAME = "adt";

  function isNormalizedDate(o) {
    return o && typeof o === "object" && !Array.isArray(o) && typeof o.year === "string" && typeof o.month === "string" && typeof o.day === "string" && typeof o.hour === "string" && typeof o.minute === "string" && typeof o.second === "string" && ["AM", "PM"].includes(o.ampm);
  }

  var name = "gphotos-auto-datetime";
  var version = "0.0.1-alpha.1";

  class Logger {
    constructor(prefix) {
      this.prefix = prefix;
    }
    print(type, ...args) {
      const msgs = ["[%s]"];
      const pArgs = [name];
      const prefix = this.prefix?.();
      if (prefix) {
        msgs.push(prefix.message);
        pArgs.push(...prefix.args);
      }
      if (args.length > 0) msgs.push(args[0]);
      const message = msgs.join(" ");
      const values = [message].concat(pArgs, args.slice(1));
      console[type](...values);
    }
    log(...args) {
      this.print("log", ...args);
    }
    warn(...args) {
      this.print("warn", ...args);
    }
    error(...args) {
      this.print("error", ...args);
    }
  }

  function zeroPad(v, n = 2) {
    return String(v).padStart(n, "0");
  }

  function parseHour(hour, max) {
    const hr = hour ? Number(hour) : null;
    if (hr != null && hr >= 0 && hr < max) return hr;
  }
  function normalizeDate(parsed) {
    let hr;
    const parsedHour = parsed.hour12 && (hr = parseHour(parsed.hour12, 12)) != null ? { hour: hr, ampm: parsed.ampm || "AM" } : (hr = parseHour(parsed.hour24, 24)) != null ? {
      hour: hr === 0 || hr === 12 ? 12 : hr - (hr < 12 ? 0 : 12),
      ampm: hr < 12 ? "AM" : "PM"
    } : null;
    if (!parsedHour) return;
    const { year } = parsed;
    const month = zeroPad(parsed.month);
    const day = zeroPad(parsed.day);
    const hour = zeroPad(parsedHour.hour);
    const minute = zeroPad(parsed.minute);
    const second = zeroPad(parsed.second);
    const ampm = parsedHour.ampm.toUpperCase();
    return { year, month, day, hour, minute, second, ampm };
  }

  const regexp$1 = /(\d{2})\/(\d{2})\/(\d{4}), (\d{2}):(\d{2}):(\d{2}) (AM|PM)/i;
  function parseDate(date) {
    if (isNaN(+date)) return;
    const match = new Intl.DateTimeFormat("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true
    }).format(date).match(regexp$1);
    if (match?.length === 8) {
      const [, month, day, year, hour12, minute, second, ampmValue] = match;
      const ampm = ampmValue.toUpperCase();
      return { year, month, day, hour12, minute, second, ampm };
    }
  }

  const dateParser = {
    name: "date",
    parse(fileName) {
      return parseDate(new Date(fileName));
    }
  };

  const regexps = [
    /(\d{4})(\d{2})(\d{2})[_-]?(\d{2})(\d{2})(\d{2})/,
    /(\d{4})-(\d{2})-(\d{2})[\s_](\d{2})-(\d{2})-(\d{2})/
  ];
  const defaultParser = {
    name: "default",
    parse(fileName) {
      for (const regexp of regexps) {
        const match = fileName.match(regexp);
        if (match?.length === 7) {
          const [, year, month, day, hour24, minute, second] = match;
          return { year, month, day, hour24, minute, second };
        }
      }
    }
  };

  const regexp = /\d{1,2} \w+ \d{4} \d{2}∶\d{2}∶\d{2}/;
  const nautilusDateParser = {
    name: "nautilus-date",
    parse(fileName) {
      const match = fileName.match(regexp);
      if (match) {
        const date = match[0].replace(/∶/g, ":");
        return parseDate(new Date(date));
      }
    }
  };

  const parsers = [defaultParser, nautilusDateParser, dateParser];
  function parse(value) {
    for (const parser of parsers) {
      const date = parser.parse(value);
      if (date) return normalizeDate(date);
    }
  }

  function isElementVisible(el) {
    return !!el && el.getBoundingClientRect().height > 0;
  }
  function findVisibleElement(list) {
    for (const el of list) if (isElementVisible(el)) return el;
  }

  function getPhotoInfo() {
    const dlEl = findVisibleElement(document.querySelectorAll("dl"));
    const fileNameEl = dlEl?.querySelector('dd [aria-label^="Filename:"]');
    const dateDetailsEl = dlEl?.querySelector('dd [aria-label^="Date taken:"]')?.parentElement?.parentElement;
    const name = fileNameEl?.textContent;
    if (name && dlEl && dateDetailsEl) {
      return { name, dlEl, dateDetailsEl };
    }
  }
  function parseInfoDate(info) {
    const dateTakenEl = info.dlEl?.querySelector(
      'dd [aria-label^="Date taken:"]'
    );
    const timeTakenEl = info.dlEl?.querySelector(
      'dd [aria-label^="Time taken:"]'
    );
    const dateTaken = dateTakenEl?.textContent;
    const timeTaken = timeTakenEl?.textContent;
    if (!dateTaken || !timeTaken) return;
    const date = dateTaken.includes(",") ? dateTaken : dateTaken + ", " + (/* @__PURE__ */ new Date()).getFullYear();
    const time = timeTaken.replace(/\s/g, " ").split(", ")[1];
    const parsed = parseDate(/* @__PURE__ */ new Date(`${date} ${time}`));
    return parsed && normalizeDate(parsed);
  }

  function parseInput(value, info) {
    if (value == null) {
      info ||= getPhotoInfo();
      return info && parse(info.name);
    }
    if (typeof value === "string") return parse(value);
    if (value instanceof Date) {
      const date = parseDate(value);
      return date && normalizeDate(date);
    }
    if (isNormalizedDate(value)) return value;
  }

  function delay(min, max = min) {
    const ms = Math.floor(Math.random() * (max - min + 1) + min);
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  function isDateEqual(a, b) {
    const props = [
      "year",
      "month",
      "day",
      "hour",
      "minute",
      "ampm"
    ];
    return props.every((prop) => a[prop] === b[prop]);
  }

  async function inputDate(parsedDate, inputs) {
    const valueList = [
      parsedDate.year,
      parsedDate.month,
      parsedDate.day,
      parsedDate.hour,
      parsedDate.minute
    ];
    const opts = { bubbles: true, cancelable: false, composed: true };
    for (let index = 0; index < valueList.length; index++) {
      const inputEl = inputs[index];
      const value = valueList[index];
      if (inputEl.value === value) continue;
      await delay(50, 150);
      inputEl.click();
      await delay(10);
      inputEl.value = value;
      await delay(10);
      inputEl.dispatchEvent(new Event("input", opts));
      await delay(10);
      inputEl.dispatchEvent(new Event("blur", opts));
      await delay(50, 150);
    }
    const ampmInputEl = inputs[valueList.length];
    if (ampmInputEl.value !== parsedDate.ampm) {
      ampmInputEl.click();
      await delay(50, 150);
    }
  }

  async function input(logger, info, parsedDate) {
    const res = { break: true };
    const infoDate = parseInfoDate(info);
    if (!infoDate) {
      logger.error("Unable to parse date and time.");
      return res;
    }
    if (!isDateEqual(parsedDate, infoDate)) {
      info.dateDetailsEl.click();
      const dialogDiv = document.querySelector("div[data-back-to-cancel]");
      if (!dialogDiv) {
        logger.error("Unable to find 'Edit Date & Time' dialog.");
        return res;
      }
      const dateInputs = dialogDiv.querySelectorAll("input");
      if (dateInputs.length !== 6) {
        logger.error("Unable to find 'Edit Date & Time' dialog fields.");
        return res;
      }
      await inputDate(parsedDate, dateInputs);
      await delay(200, 400);
      const buttons = dialogDiv.querySelectorAll("button");
      const saveButtonEl = buttons[1];
      if (!saveButtonEl) {
        logger.error("Unable to find the 'Save' dialog action button.");
        return res;
      }
      {
        saveButtonEl.click();
        logger.log(
          "Saved date and time for %o. Parsed: %o",
          info.name,
          parsedDate
        );
        await delay(1e3, 1500);
        res.infoDate = parseInfoDate(info);
        res.success = !!res.infoDate && isDateEqual(parsedDate, res.infoDate);
      }
    } else {
      logger.log(
        "Photo %o already has the correct date and time. Skipping.",
        info.name
      );
      res.skipped = true;
    }
    res.break = false;
    return res;
  }

  const meta = { name, version };

  function navigate(logger, type) {
    const label = `View ${type} photo`;
    const photoContainerEl = findVisibleElement(
      document.querySelectorAll("c-wiz[data-media-key]")
    );
    const buttonDiv = photoContainerEl?.parentElement?.querySelector(
      `div[role=button][aria-label="${label}"]`
    );
    if (!buttonDiv) {
      logger.error("Unable to find the %o photo button.", type);
    } else if (!isElementVisible(buttonDiv)) {
      logger.warn(
        "The %o photo button is not visible (%s of photos).",
        type,
        type === "next" ? "end" : "start"
      );
    } else {
      buttonDiv.click();
      return true;
    }
  }

  let stop = false;
  let running;
  let result = { success: 0, skipped: 0 };
  let parserFn;
  async function run() {
    const MAX_RETRIES = 5;
    let nth = 1;
    let attempts = 0;
    let prevName;
    const logger = new Logger(() => ({ message: "[%o]", args: [nth] }));
    function retry() {
      return attempts++ < MAX_RETRIES;
    }
    while (!stop) {
      await delay(500, 1500);
      const info = getPhotoInfo();
      if (!info) {
        if (!retry()) {
          logger.error("Unable to find the file name.");
          break;
        }
        logger.warn(
          "Unable to find the file name. Retrying %o of %o.",
          attempts,
          MAX_RETRIES
        );
        continue;
      }
      if (prevName === info.name) {
        if (!retry()) {
          logger.error("File name %o did not change.", prevName);
          break;
        }
        logger.warn(
          "File name %o did not change. Retrying %o of %o.",
          prevName,
          attempts,
          MAX_RETRIES
        );
        continue;
      }
      prevName = info.name;
      const parsed = typeof parserFn === "function" && parserFn(info.name);
      const parsedDate = isNormalizedDate(parsed) ? parsed : parse(info.name);
      if (!parsedDate) {
        logger.error("Unable to parse name: %o", info.name);
        break;
      }
      const inputResult = await input(logger, info, parsedDate);
      if (inputResult.success) result.success++;
      if (inputResult.skipped) result.skipped++;
      if (stop || inputResult.break) break;
      if (inputResult.success === false) {
        logger.warn(
          "Photo date and time not updated for %o. Parsed: %o Details: %o",
          info.name,
          parsedDate,
          inputResult.infoDate
        );
        if (!retry()) break;
        continue;
      }
      if (!navigate(logger, "next")) break;
      nth++;
      attempts = 0;
    }
  }
  const LOG = new Logger();
  function summary(result2, message, ...args) {
    LOG.log(
      `${message}
- Success: %o
- Skipped: %o
- Total: %o`,
      ...args,
      result2.success,
      result2.skipped,
      result2.success + result2.skipped
    );
  }
  function block() {
    LOG.warn(
      "Cannot perform this action while %o is running. Enter %o to stop.",
      NAME,
      `${NAME}.stop()`
    );
  }
  const instance = {
    meta,
    info() {
      const info = getPhotoInfo();
      return info && { name: info.name, date: parseInfoDate(info) };
    },
    next() {
      if (running) return block();
      navigate(LOG, "next");
    },
    previous() {
      if (running) return block();
      navigate(LOG, "previous");
    },
    parse(value) {
      return parseInput(value);
    },
    async input(value) {
      if (running) return block();
      const info = getPhotoInfo();
      if (!info) {
        LOG.error("Unable to parse date and time info.");
        return;
      }
      const parsedDate = parseInput(value, info);
      if (!parsedDate) {
        LOG.error("Unable to parse input: %o", value);
        return;
      }
      await input(LOG, info, parsedDate);
    },
    start(parser) {
      parserFn = parser;
      const msg = "Enter %o to stop and %o to check status.";
      const args = [`${NAME}.stop()`, `${NAME}.status()`];
      if (running) {
        LOG.warn(`%o already started. ${msg}`, NAME, ...args);
      } else {
        LOG.log(`Starting %o. ${msg}`, NAME, ...args);
        stop = false;
        result = { success: 0, skipped: 0 };
        running = run().finally(() => {
          running = void 0;
          summary(
            result,
            "%s. Enter %o to start again.",
            stop ? "Stopped" : "Done",
            `${NAME}.start()`
          );
        });
      }
      return running;
    },
    stop() {
      stop = true;
      if (running) LOG.log("Stopping %o.", NAME);
      return running;
    },
    status() {
      summary(result, "Status: %o", running ? "Running" : "Not Running");
    }
  };
  async function init() {
    const adt = window[NAME];
    if (adt && typeof adt === "object" && typeof adt.stop === "function") {
      await adt.stop();
    }
    if (!stop) instance.start();
  }

  init();

  return instance;

})();
