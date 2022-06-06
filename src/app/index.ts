import { Parser } from "@himenon/message-command-parser";
import { EventEmitter } from "events";

import * as Subscriber from "../subscriber";
import type { Payload, SlackPayload } from "../types/subscriber";
import * as Config from "./message-config";

export class App {
  private messageParser: Parser;
  private emitter = new EventEmitter();
  constructor() {
    this.messageParser = new Parser({
      messageItems: Config.MessageItems,
    });
    this.initialize();
  }

  private initialize() {
    this.on(Config.Ping.command, Subscriber.ping);
    this.on(Config.Version.command, Subscriber.version);
  }

  private on = (command: string, callback: (payload: Payload) => Promise<void>) => {
    this.emitter.on(command, async (payload: Payload) => {
      // await payload.slack.updateReaction({
      //   add: ["think_loading"],
      // });
      let success: boolean;
      try {
        await callback(payload);
        success = true;
      } catch (error) {
        await payload.slack.say((error as Error).message);
        console.error(error);
        success = false;
      }
      // await payload.slack.updateReaction({
      //   add: success ? ["done"] : ["fail"],
      //   delete: ["think_loading"],
      // });
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
