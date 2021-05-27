export type File = {
	fileName: string;
	content: Buffer;
};

export interface FilePayload {
	files: File[];
}
