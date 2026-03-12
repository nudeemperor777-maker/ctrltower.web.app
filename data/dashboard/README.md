# Dashboard Seed Data

These JSON files are read at runtime by the `/jarvis` page via `fs.readFileSync`.

On **Vercel**, the files are bundled into the serverless function through
`outputFileTracingIncludes` in `next.config.ts`.

To override the data directory (e.g. point to a shared volume or external path),
set the `DASHBOARD_DATA_DIR` environment variable to an absolute path.

## Files

| File                  | Purpose                        |
|-----------------------|--------------------------------|
| `tasks.json`          | Kanban task board data         |
| `products.json`       | Product catalog entries        |
| `human-tasks.json`    | Tasks requiring human action   |
| `upwork-messages.json`| Upwork message thread summaries|
