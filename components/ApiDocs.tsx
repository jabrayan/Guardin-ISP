import React from 'react';
import { Copy } from 'lucide-react';

const ApiDocs: React.FC = () => {
  const openApiSpec = {
    openapi: "3.0.0",
    info: {
      title: "Sentinel Monitor API",
      version: "1.0.0"
    },
    paths: {
      "/api/v1/hosts": {
        "get": {
          "summary": "List hosts",
          "tags": ["Hosts"],
          "parameters": [
            { "name": "group", "in": "query", "schema": { "type": "string" } }
          ]
        },
        "post": {
          "summary": "Create host",
          "tags": ["Hosts"],
          "requestBody": {
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "name": { "type": "string" },
                    "ip": { "type": "string" }
                  }
                }
              }
            }
          }
        }
      },
      "/api/v1/events/stream": {
        "get": {
          "summary": "Subscribe to real-time events via WebSocket",
          "tags": ["Events"]
        }
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">API Reference</h2>
          <p className="text-slate-400 text-sm">OpenAPI 3.0 Specification & Endpoints</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-lg border border-slate-700 hover:bg-slate-700">
           <Copy className="h-4 w-4" /> Copy Spec
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                <h3 className="font-semibold text-white mb-3">Authentication</h3>
                <p className="text-sm text-slate-400 mb-2">Bearer Token (JWT)</p>
                <div className="bg-slate-950 p-2 rounded text-xs font-mono text-green-400 overflow-hidden text-ellipsis whitespace-nowrap">
                    Authorization: Bearer eyJhbGciOiJI...
                </div>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                <h3 className="font-semibold text-white mb-3">Rate Limits</h3>
                <div className="flex justify-between text-sm text-slate-400 py-1 border-b border-slate-800">
                    <span>Standard</span>
                    <span className="text-white">1000 req/min</span>
                </div>
                <div className="flex justify-between text-sm text-slate-400 py-1 pt-2">
                    <span>Batch Ingest</span>
                    <span className="text-white">50 MB/req</span>
                </div>
            </div>
        </div>

        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col h-[600px]">
            <div className="bg-slate-950 px-4 py-2 border-b border-slate-800 flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-red-500"></div>
                <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                <div className="h-3 w-3 rounded-full bg-green-500"></div>
                <span className="ml-2 text-xs text-slate-500 font-mono">openapi-spec.json</span>
            </div>
            <pre className="flex-1 p-4 overflow-auto text-sm font-mono text-blue-300">
                {JSON.stringify(openApiSpec, null, 2)}
            </pre>
        </div>
      </div>
    </div>
  );
};

export default ApiDocs;