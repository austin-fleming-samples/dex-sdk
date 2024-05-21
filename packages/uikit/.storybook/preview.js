import { Currency } from "@<REDACTED>/utils";
import { withThemesProvider, DEFAULT_SETTINGS } from "themeprovider-storybook";
import { <REDACTED>ThemeProvider } from "../src/components/<REDACTED>ThemeProvider";
import { Themes } from "../src/themes";

const themes = Object.values(Themes);

const tokenLogoResolver = (address) =>
  `https://icon-service.<REDACTED>.report/icon_bsc?token=${address}`;

const tokenLink = (address) => `https://bscscan.com/token/${address}`;
const isNativeToken = (currency) => currency.address === "BNB";

export const decorators = [
  (StoryFn) => <StoryFn />,
  withThemesProvider(themes, DEFAULT_SETTINGS, ({ theme, children }) => {
    return (
      <<REDACTED>ThemeProvider
        theme={theme}
        options={{ tokenLogoResolver, tokenLink, isNativeToken }}
        notifications={{ position: "top-right" }}
      >
        {children}
      </<REDACTED>ThemeProvider>
    );
  }),
];
