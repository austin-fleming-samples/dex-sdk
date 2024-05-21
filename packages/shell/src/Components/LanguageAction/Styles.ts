import { mediaQueries } from "@<REDACTED>/uikit";
import styled from "styled-components";

export const LanguageActionWrapper = styled.span`
  display: flex;
  align-items: center;

  svg {
    display: none;
    margin-right: 0.3rem;

    ${mediaQueries.sm} {
      display: inline;
    }
  }
`;
