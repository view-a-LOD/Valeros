export enum Direction {
  Incoming = 0,
  Outgoing = 1,
}

export interface NodeObj {
  value: string;
  direction?: Direction;
}

export interface NodeModel {
  '@id': NodeObj[];
  endpointId: NodeObj[];
  [pred: string]: NodeObj[];
}
