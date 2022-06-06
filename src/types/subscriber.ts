import type * as slack from "@slack/bolt";

export interface NextPayload {
  message: string;
}

export type NextFn = slack.SayFn;

export interface ListenPayload {
  message: string;
  thread_ts: string;
}

export interface Subscriber {
  run: (payload: ListenPayload, callback: NextFn) => Promise<void>;
}

export interface SlackPayload {
  message: string;
  thread_ts?: string;
  say: slack.SayFn;
  updateReaction: (params: { delete?: string[]; add?: string[] }) => Promise<any>;
}

export interface Payload<Key extends string = string> {
  action: string;
  actionTargets: string[];
  parameters: Record<Key, string[] | undefined>;
  slack: SlackPayload;
}

export type Callback<Key extends string = string> = (payload: Payload<Key>) => Promise<void>;
