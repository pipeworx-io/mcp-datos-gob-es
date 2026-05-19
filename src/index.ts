interface McpToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
}

interface McpToolExport {
  tools: McpToolDefinition[];
  callTool: (name: string, args: Record<string, unknown>) => Promise<unknown>;
  meter?: { credits: number };
  cost?: Record<string, unknown>;
  provider?: string;
}

/**
 * datos.gob.es MCP.
 */


const BASE = 'https://datos.gob.es/apidata';
const UA = 'pipeworx-mcp-datos-gob-es/1.0 (+https://pipeworx.io)';

const tools: McpToolExport['tools'] = [
  { name: 'datasets', description: 'Search datasets.', inputSchema: { type: 'object', properties: { query: { type: 'string' }, page: { type: 'number' }, page_size: { type: 'number' }, theme: { type: 'string' } } } },
  { name: 'dataset', description: 'Single dataset.', inputSchema: { type: 'object', properties: { id: { type: 'string' } }, required: ['id'] } },
  { name: 'publishers', description: 'List publishers.', inputSchema: { type: 'object', properties: { limit: { type: 'number' } } } },
  { name: 'themes', description: 'List themes.', inputSchema: { type: 'object', properties: { limit: { type: 'number' } } } },
];

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  switch (name) {
    case 'datasets': {
      const page = Math.max(0, (args.page as number) ?? 0);
      const pageSize = Math.min(50, Math.max(1, (args.page_size as number) ?? 10));
      const p = new URLSearchParams({ _page: String(page), _pageSize: String(pageSize), _sort: 'title' });
      if (args.query) p.set('_search', String(args.query));
      if (args.theme) p.set('theme', String(args.theme));
      return dgGet(`/catalog/dataset?${p}`);
    }
    case 'dataset':
      return dgGet(`/catalog/dataset/${encodeURIComponent(reqStr(args, 'id', '"<id>"'))}`);
    case 'publishers': {
      const limit = Math.min(50, Math.max(1, (args.limit as number) ?? 50));
      return dgGet(`/catalog/publisher?_pageSize=${limit}`);
    }
    case 'themes': {
      const limit = Math.min(50, Math.max(1, (args.limit as number) ?? 50));
      return dgGet(`/catalog/theme?_pageSize=${limit}`);
    }
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

async function dgGet(path: string): Promise<unknown> {
  const res = await fetch(`${BASE}${path}`, { headers: { Accept: 'application/json', 'User-Agent': UA } });
  if (res.status === 404) throw new Error('datos.gob.es: not found');
  if (!res.ok) throw new Error(`datos.gob.es: ${res.status}`);
  return res.json();
}

function reqStr(args: Record<string, unknown>, key: string, example: string): string {
  const v = args[key];
  if (typeof v !== 'string' || !v.trim()) throw new Error(`Required argument "${key}" is missing. Pass a string like ${example}.`);
  return v;
}

export default { tools, callTool, meter: { credits: 1 } } satisfies McpToolExport;
