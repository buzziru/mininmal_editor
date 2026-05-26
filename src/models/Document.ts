export interface Document {
  path: string;
  title: string;
  content: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface DocumentMetadata {
  path: string;
  title: string;
  updatedAt?: Date;
}
