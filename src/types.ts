export interface Token {
  $type: string;
  $value: string;
  $description?: string;
}

export interface ThemeTokens {
  [key: string]: Token | ThemeTokens;
}

export interface CoreTokens {
  [key: string]: Token | CoreTokens;
}

export interface Tokens {
  light: ThemeTokens;
  dark: ThemeTokens;
  core: CoreTokens;
}
