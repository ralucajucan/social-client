export interface IMessage {
  id: number;
  sender: string;
  receiver: string;
  text: string;
  attachmentIds: string;
  attachments: IFile[];
  status: 'DRAFT' | 'SENT' | 'RECEIVED' | 'READ' | 'REMOVED';
  createdOn: string;
  sentOn: string;
  updatedOn: string;
}

export interface IFile {
  id: string;
  name: string;
  type: string;
  size: number;
  file: Blob;
}

export interface SendDTO {
  text: string;
  user: string;
  attachmentIds: string;
}

export interface IContact {
  email: string;
  name: string;
  online: boolean;
  newMessages: number;
}
