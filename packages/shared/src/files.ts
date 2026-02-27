export type UploadFile = {
  uri: string;
  type?: string | null;
  name?: string | null;
};

export type FileInput = Blob | UploadFile;
