export interface INotification {
  sender: string;
  text: string;
  attachments: string;
}
export interface IMessage {
  id: number;
  sender: string;
  receiver: string;
  text: string;
  attachmentIds: string;
  attachments: IFile[];
  status: 'DRAFT' | 'SENT' | 'RECEIVED' | 'READ' | 'REMOVED';
  edited: boolean;
  createdOn: string;
  updatedOn: string;
}

export interface IFile {
  id: string;
  name: string;
  type: string;
  size: number;
  file: Blob | File;
}

export interface SendDTO {
  text: string;
  user: string;
}

export interface IContact {
  email: string;
  name: string;
  online: boolean;
  received: number;
}

export interface RemoveAttachment {
  attachmentId: string;
  messageId: number | undefined;
}
