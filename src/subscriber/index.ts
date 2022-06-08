import { VERSION } from "../config/version";
import type * as Types from "../types/subscriber";

export const ping: Types.Callback = async payload => {
  const { slack } = payload;
  await slack.say({
    text: "pong",
    thread_ts: slack.thread_ts,
  });
};

export const version: Types.Callback = async payload => {
  const { slack } = payload;
  await slack.say({
    text: `Version: ${VERSION}`,
    thread_ts: slack.thread_ts,
  });
};
