# @pipeworx/datos-gob-es

[datos.gob.es](https://datos.gob.es) MCP — Spanish open-data catalogue. Keyless.

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 1394+ live data sources.

## Tools

- `datasets(query?, page?, page_size?, theme?)` — search datasets
- `dataset(id)` — single dataset
- `publishers(limit?)` — list publishers
- `themes(limit?)` — list themes (DCAT classification)

## Data source

`https://datos.gob.es/apidata/`

## Quick Start

Add to your MCP client (Claude Desktop, Cursor, Windsurf, etc.):

```json
{
  "mcpServers": {
    "datos-gob-es": {
      "url": "https://gateway.pipeworx.io/datos-gob-es/mcp"
    }
  }
}
```

Or connect to the full Pipeworx gateway for access to all 1394+ data sources:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English:

```
ask_pipeworx({ question: "your question about Datos Gob Es data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [Docs and guides](https://pipeworx.io/docs)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
