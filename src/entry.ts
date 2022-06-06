import * as Slack from "./slack";

process.on("unhandledRejection", console.dir);

const main = async () => {
  const slackServer = new Slack.Server();
  await slackServer.initialize();
  await slackServer.start();
};

main().catch(error => {
  console.error(error);
  process.exit(1);
});
