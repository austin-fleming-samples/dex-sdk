import "styled-components";
import { <REDACTED>Theme } from "../themes";

declare module "styled-components" {
  /* eslint-disable @typescript-eslint/no-empty-interface */
  export interface DefaultTheme extends <REDACTED>Theme {}
}
