import { Types } from "./_types";

// The basic structure of a Convert service
export abstract class Converter<T extends Types> {
    static toTypes<T>(jsonString: string): T[] {
        return JSON.parse(jsonString);
    }

    static typesToJson<T>(types: T[]): string {
        return JSON.stringify(types);
    }
}