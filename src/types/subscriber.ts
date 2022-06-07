import type * as slack from "@slack/bolt";

export interface SlackPayload {
  message: string;
  thread_ts?: string;
  say: slack.SayFn;
  updateReaction: (params: { delete?: string[]; add?: string[] }) => Promise<unknown>;
}

export interface Payload<Key extends string = string> {
  action: string;
  actionTargets: string[];
  parameters: Record<Key, string[] | undefined>;
  slack: SlackPayload;
}

export type Callback<Key extends string = string> = (payload: Payload<Key>) => Promise<void>;
