import { Parser } from "@himenon/message-command-parser";
import { EventEmitter } from "events";

import * as CommandConfig from "../config/command";
import * as Subscriber from "../subscriber";
import type { Callback, Payload, SlackPayload } from "../types/subscriber";

export class App {
  private messageParser: Parser;
  private emitter = new EventEmitter();
  constructor() {
    this.messageParser = new Parser({
      messageItems: CommandConfig.MessageItems,
    });
    this.initialize();
  }

  private initialize() {
    this.on(CommandConfig.Ping.command, Subscriber.ping);
    this.on(CommandConfig.Version.command, Subscriber.version);
  }

  private on = (command: string, callback: Callback) => {
    const run = async (payload: Payload) => {
      try {
        await callback(payload);
        return { error: undefined };
      } catch (error) {
        await payload.slack.say((error as Error).message);
        console.error(error);
        return { error: error };
      }
    };
    this.emitter.on(command, async (payload: Payload) => {
      await payload.slack.updateReaction({
        add: ["hourglass_flowing_sand"],
      });
      const { error } = await run(payload);
      if (error) {
        console.error(error);
      }
      await payload.slack.updateReaction({
        add: error ? ["no_entry_sign"] : ["white_check_mark"],
        delete: ["hourglass_flowing_sand"],
      });
    });
  };

  public emit(slackPayload: SlackPayload) {
    const [_, ...parts] = slackPayload.message.split(/\s/);
    const message = parts.join(" ");
    const parsedValue = this.messageParser.parse(message);
    if (parsedValue.kind === "plain") {
      const payload: Payload = {
        action: parsedValue.message,
        actionTargets: [],
        parameters: {},
        slack: slackPayload,
      };
      this.emitter.emit(parsedValue.message, payload);
      return;
    } else {
      const payload: Payload = {
        action: parsedValue.action,
        actionTargets: parsedValue.actionTargets,
        parameters: parsedValue.parameters || {},
        slack: slackPayload,
      };
      this.emitter.emit(parsedValue.matched, payload);
    }
  }
}
