declare module '*.css';

declare module '*.svg?url' {
  const content: string;
  export default content;
} 