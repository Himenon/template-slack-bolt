import type { AppOptions } from "@slack/bolt";
import SlackBolt from "@slack/bolt/dist/App";

import { App } from "../app/index";
import { VERSION } from "../config/version";

export class Server {
  private app = new App();
  private slackApp: SlackBolt;
  constructor() {
    const appOptions: AppOptions = {
      socketMode: true,
      token: process.env.SLACK_BOT_TOKEN,
      appToken: process.env.SLACK_APP_TOKEN,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      // logLevel: "debug"
      // logLevel: LogLevel.DEBUG,
    };
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore 正直意味がわからない。webpackのときはSlackBoltで動く。ts-nodeはSlackBolt.defaultで動く
    const Klass = process.env.BUILD === "webpack" ? SlackBolt : SlackBolt.default;
    this.slackApp = new Klass(appOptions);
  }

  /**
   * SlackのEvent
   * https://api.slack.com/events
   */
  public async initialize() {
    this.slackApp.message("*", async payload => {
      console.log(payload);
    });

    this.slackApp.event("app_mention", async args => {
      const { payload, say, client } = args;
      console.log(`Receive: ${payload.text}`);

      const updateReaction = async (params: { delete?: string[]; add?: string[] }): Promise<any> => {
        const deleteList: string[] = params.delete || [];
        const addList: string[] = params.add || [];
        const list1 = addList.map(name => {
          return client.reactions.add({
            channel: payload.channel,
            name: name,
            timestamp: payload.ts,
          });
        });
        const list2 = deleteList.map(name => {
          return client.reactions.remove({
            channel: payload.channel,
            name: name,
            timestamp: payload.ts,
          });
        });
        return await Promise.all([...list1, ...list2]);
      };

      this.app.emit({
        message: payload.text,
        thread_ts: payload.thread_ts,
        say: say,
        updateReaction: updateReaction,
      });
    });
    console.log("⚡️ Bolt app is initialized!");
  }

  public async start(): Promise<void> {
    await this.slackApp.start();
    console.log("⚡️ Bolt app is running!");
    console.log(`⚡️ Bot Version: ${VERSION}`);
  }

  public async close(): Promise<void> {
    console.log("⚡️ Bolt app is stop!");
    await this.slackApp.stop();
  }
}
