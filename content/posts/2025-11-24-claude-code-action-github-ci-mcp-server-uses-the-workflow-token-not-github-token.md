---
title: "Claude Code Action: github_ci MCP Server Uses the Workflow Token, Not github_token"
lang: en
published: 2025-11-24
gist_url: "https://gist.github.com/otariidae/39ba2374ef508fbfcd4b9201ac492d42"
---

When using Claude Code Action, you might see the following warning:

> Warning: The github_ci MCP server requires 'actions: read' permission. Please ensure your GitHub token has this permission. See: https://docs.github.com/en/actions/security-guides/automatic-token-authentication#permissions-for-the-github_token

If you are using a custom token (e.g., via a custom GitHub App), you might assume you need to grant the `actions: read` permission to that specific token.

```yaml
- uses: anthropics/claude-code-action@v1
  with:
    # Let's elevate this token's privileges?
    github_token: ${{ steps.app-token.outputs.token }}
```

This is incorrect.

The github_ci MCP server is implemented to use the default workflow token (`github.token`), regardless of the `github_token` input you provide.

https://github.com/anthropics/claude-code-action/blob/798cf0988d672fc8049482ce79e55d909193e150/src/mcp/install-mcp-server.ts#L184-L199
https://github.com/anthropics/claude-code-action/blob/798cf0988d672fc8049482ce79e55d909193e150/action.yml#L177

To resolve the warning, simply follow the message literally and ensure your workflow's token has the necessary permissions.
