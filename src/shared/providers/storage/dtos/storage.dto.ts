export abstract class IStorageProvider {
	abstract saveFile(file: File): Promise<void>;

	abstract createFolder(): Promise<void>;
}
