import { Direction, NodeModel } from '@valeros/shared/types';

export const mockNodes: NodeModel[] = [
  {
    '@id': [{ value: 'http://example.org/node/1', direction: Direction.Outgoing }],
    endpointId: [{ value: 'mock-endpoint', direction: Direction.Outgoing }],
    'http://www.w3.org/2000/01/rdf-schema#label': [
      { value: 'Mock Node 1', direction: Direction.Outgoing },
    ],
    'http://purl.org/dc/terms/description': [
      { value: 'This is a mock node from the backend', direction: Direction.Outgoing },
    ],
    'http://www.w3.org/1999/02/22-rdf-syntax-ns#type': [
      { value: 'http://example.org/MockType', direction: Direction.Outgoing },
    ],
  },
  {
    '@id': [{ value: 'http://example.org/node/2', direction: Direction.Outgoing }],
    endpointId: [{ value: 'mock-endpoint', direction: Direction.Outgoing }],
    'http://www.w3.org/2000/01/rdf-schema#label': [
      { value: 'Mock Node 2', direction: Direction.Outgoing },
    ],
    'http://purl.org/dc/terms/description': [
      { value: 'Another mock node for testing', direction: Direction.Outgoing },
    ],
    'http://www.w3.org/1999/02/22-rdf-syntax-ns#type': [
      { value: 'http://example.org/MockType', direction: Direction.Outgoing },
    ],
  },
  {
    '@id': [{ value: 'http://example.org/node/3', direction: Direction.Outgoing }],
    endpointId: [{ value: 'mock-endpoint', direction: Direction.Outgoing }],
    'http://www.w3.org/2000/01/rdf-schema#label': [
      { value: 'Mock Node 3', direction: Direction.Outgoing },
    ],
    'http://purl.org/dc/terms/description': [
      { value: 'Third mock node with sample data', direction: Direction.Outgoing },
    ],
    'http://www.w3.org/1999/02/22-rdf-syntax-ns#type': [
      { value: 'http://example.org/MockType', direction: Direction.Outgoing },
    ],
  },
  {
    '@id': [{ value: 'http://example.org/node/4', direction: Direction.Outgoing }],
    endpointId: [{ value: 'mock-endpoint', direction: Direction.Outgoing }],
    'http://www.w3.org/2000/01/rdf-schema#label': [
      { value: 'Test Document', direction: Direction.Outgoing },
    ],
    'http://purl.org/dc/terms/description': [
      { value: 'A test document for search functionality', direction: Direction.Outgoing },
    ],
    'http://www.w3.org/1999/02/22-rdf-syntax-ns#type': [
      { value: 'http://example.org/Document', direction: Direction.Outgoing },
    ],
  },
  {
    '@id': [{ value: 'http://example.org/node/5', direction: Direction.Outgoing }],
    endpointId: [{ value: 'mock-endpoint', direction: Direction.Outgoing }],
    'http://www.w3.org/2000/01/rdf-schema#label': [
      { value: 'Sample Resource', direction: Direction.Outgoing },
    ],
    'http://purl.org/dc/terms/description': [
      { value: 'Sample resource for demonstration', direction: Direction.Outgoing },
    ],
    'http://www.w3.org/1999/02/22-rdf-syntax-ns#type': [
      { value: 'http://example.org/Resource', direction: Direction.Outgoing },
    ],
  },
];
