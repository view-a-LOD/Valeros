import { Injectable } from '@nestjs/common';

// TODO: Share these types between front-end and back-end
interface SearchRequest {
  query: string;
  page: number;
  pageSize: number;
}

interface NodeObj {
  value: string;
  direction?: number;
}

interface NodeModel {
  '@id': NodeObj[];
  endpointId: NodeObj[];
  [pred: string]: NodeObj[];
}

interface SearchResponse {
  nodes: NodeModel[];
  total: number;
  isCapped: boolean;
}

@Injectable()
export class SearchService {
  private mockNodes: NodeModel[] = [
    {
      '@id': [{ value: 'http://example.org/node/1', direction: 1 }],
      endpointId: [{ value: 'mock-endpoint', direction: 1 }],
      'http://www.w3.org/2000/01/rdf-schema#label': [
        { value: 'Mock Node 1', direction: 1 },
      ],
      'http://purl.org/dc/terms/description': [
        { value: 'This is a mock node from the backend', direction: 1 },
      ],
      'http://www.w3.org/1999/02/22-rdf-syntax-ns#type': [
        { value: 'http://example.org/MockType', direction: 1 },
      ],
    },
    {
      '@id': [{ value: 'http://example.org/node/2', direction: 1 }],
      endpointId: [{ value: 'mock-endpoint', direction: 1 }],
      'http://www.w3.org/2000/01/rdf-schema#label': [
        { value: 'Mock Node 2', direction: 1 },
      ],
      'http://purl.org/dc/terms/description': [
        { value: 'Another mock node for testing', direction: 1 },
      ],
      'http://www.w3.org/1999/02/22-rdf-syntax-ns#type': [
        { value: 'http://example.org/MockType', direction: 1 },
      ],
    },
    {
      '@id': [{ value: 'http://example.org/node/3', direction: 1 }],
      endpointId: [{ value: 'mock-endpoint', direction: 1 }],
      'http://www.w3.org/2000/01/rdf-schema#label': [
        { value: 'Mock Node 3', direction: 1 },
      ],
      'http://purl.org/dc/terms/description': [
        { value: 'Third mock node with sample data', direction: 1 },
      ],
      'http://www.w3.org/1999/02/22-rdf-syntax-ns#type': [
        { value: 'http://example.org/MockType', direction: 1 },
      ],
    },
    {
      '@id': [{ value: 'http://example.org/node/4', direction: 1 }],
      endpointId: [{ value: 'mock-endpoint', direction: 1 }],
      'http://www.w3.org/2000/01/rdf-schema#label': [
        { value: 'Test Document', direction: 1 },
      ],
      'http://purl.org/dc/terms/description': [
        { value: 'A test document for search functionality', direction: 1 },
      ],
      'http://www.w3.org/1999/02/22-rdf-syntax-ns#type': [
        { value: 'http://example.org/Document', direction: 1 },
      ],
    },
    {
      '@id': [{ value: 'http://example.org/node/5', direction: 1 }],
      endpointId: [{ value: 'mock-endpoint', direction: 1 }],
      'http://www.w3.org/2000/01/rdf-schema#label': [
        { value: 'Sample Resource', direction: 1 },
      ],
      'http://purl.org/dc/terms/description': [
        { value: 'Sample resource for demonstration', direction: 1 },
      ],
      'http://www.w3.org/1999/02/22-rdf-syntax-ns#type': [
        { value: 'http://example.org/Resource', direction: 1 },
      ],
    },
  ];

  searchNodes(request: SearchRequest): SearchResponse {
    const { query, page, pageSize } = request;

    let filteredNodes = this.mockNodes;

    if (query && query.trim()) {
      const lowerQuery = query.toLowerCase();
      filteredNodes = this.mockNodes.filter((node) => {
        const label =
          node['http://www.w3.org/2000/01/rdf-schema#label']?.[0]?.value;
        const description =
          node['http://purl.org/dc/terms/description']?.[0]?.value;
        return (
          label?.toLowerCase().includes(lowerQuery) ||
          description?.toLowerCase().includes(lowerQuery)
        );
      });
    }

    const total = filteredNodes.length;
    const start = page * pageSize;
    const end = start + pageSize;
    const paginatedNodes = filteredNodes.slice(start, end);

    return {
      nodes: paginatedNodes,
      total,
      isCapped: false,
    };
  }
}
