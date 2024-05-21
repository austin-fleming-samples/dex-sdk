import Dark from "./Dark";

export const Themes = {
  Dark,
};

export type <REDACTED>Theme = typeof Dark;
export type Themed<T extends Record<string, any> = Record<string, any>> = {
  theme: <REDACTED>Theme;
} & T;

export * from "./base";
