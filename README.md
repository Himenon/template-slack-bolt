# @himenon/template-slack-bolt

## Development

- [Set Slack App](./SETUP_SLACK_APP.md)

**Install**

```bash
pnpm install
```

**Watch**

```bash
pnpm watch
```

**Build**

```bash
pnpm build
```

**Build Docker Image**

```bash
docker build . -t ghcr.io/himenon/template-slack-bolt:local
```

**Docker Run**

```bash
docker run --rm --env-file=.env.production ghcr.io/himenon/template-slack-bolt:local

# Daemon
docker run --rm --env-file=.env.production -d ghcr.io/himenon/template-slack-bolt:local
```

### Environment File

`.env.production`

```
SLACK_APP_TOKEN=xapp-****
SLACK_BOT_TOKEN=xoxb-****
```

## Release

- Automatic version updates are performed when merged into the `main` branch.

## LICENCE

[@himenon/template-slack-bolt](https://github.com/Himenon/template-slack-bolt)・MIT
