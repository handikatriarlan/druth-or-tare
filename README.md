# druth-or-tare

## Local Development

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.js
```

## Docker

Build and run with Docker Compose:

```bash
docker-compose up -d
```

View logs:

```bash
docker-compose logs -f
```

Stop the bot:

```bash
docker-compose down
```

Rebuild after code changes:

```bash
docker-compose up -d --build
```

This project was created using `bun init` in bun v1.3.2. [Bun](https://bun.com) is a fast all-in-one JavaScript runtime.
