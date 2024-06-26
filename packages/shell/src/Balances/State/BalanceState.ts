import { Currency } from "@<REDACTED>/utils";

export interface BalancesState {
  // Balances
  balances: Array<{ currency: Currency; balance: string }>;
  refreshingBalances: boolean;
  // Prices
  unfiPrice: string;
}

export const getBalancesInitialState: () => BalancesState = () => ({
  balances: [],
  refreshingBalances: false,
  unfiPrice: localStorage.getItem("UNFI_PRICE") ?? "0.0",
});
