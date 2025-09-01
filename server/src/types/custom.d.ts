declare module 'otp-generator' {
  interface GenerateOptions {
    upperCaseAlphabets?: boolean;
    lowerCaseAlphabets?: boolean;
    specialChars?: boolean;
    digits?: boolean;
  }
  
  export function generate(length: number, options?: GenerateOptions): string;
}