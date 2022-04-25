/* TypeScript declarations for a park's properties. Allows developers to leverage the power of Intellisense
for a smoother programming experience, and helps catch more bugs in development as opposed to in production. */
export type Park = {
    title: string,
    id: number,
    dogabble: boolean,
    activities: string[],
    transportation: string[],
    region: string,
    utilities: string[],
    x: number,
    y: number
}