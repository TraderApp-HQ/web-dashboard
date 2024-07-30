import type { ICurrency } from "~/lib/types";
import type { ITBody, ITableMobile } from "~/components/common/DataTable/config";
import { currenciesTableHeadItems } from "./constants";
import { renderDisplayItem } from "~/helpers";
import { ROUTES } from "~/config/constants";

export function currenciesDataTableSelector(currencies: ICurrency[]) {
  const tableHead = [...currenciesTableHeadItems];
  const tableBody: ITBody = {
    tBodyRows: currencies.map((currency) => ({
      tBodyColumns: [
        {
          displayItem: renderDisplayItem({
            itemText: { text: currency.currency, style: "text-base font-normal" },
            itemSubText: { text: currency.shortName },
            itemImage: currency.logoUrl,
          }),
        },
        { displayItem: currency.balance },
      ],
      actions: [
        {
          label: "Deposit",
          url: ROUTES.wallet.deposit,
        },
        {
          label: "Withdraw",
          url: ROUTES.wallet.withdraw,
        },
        {
          label: "Transfer",
          url: ROUTES.wallet.transfer,
        },
        {
          label: "Convert",
          url: ROUTES.wallet.convert,
        },
      ],
    })),
  };

  return { tableHead, tableBody };
}

export function currenciesDataTableMobileSelector(currencies: ICurrency[]) {
  const dataMobile: ITableMobile[] = currencies.map((currency) => ({
    tHead: {
      displayItemTitle: renderDisplayItem({
        itemText: { text: currency.shortName, style: "text-base font-normal" },
        itemSubText: { text: currency.currency },
        itemImage: currency.logoUrl,
      }),
      displayItemValue: "",
    },
    actions: [
      {
        label: "Deposit",
        url: ROUTES.wallet.deposit,
      },
      {
        label: "Withdraw",
        url: ROUTES.wallet.withdraw,
      },
      {
        label: "Transfer",
        url: ROUTES.wallet.transfer,
      },
      {
        label: "Convert",
        url: ROUTES.wallet.convert,
      },
    ],
    tBody: [
      {
        displayItemTitle: "Available Balance",
        displayItemValue: `${currency.balance}`,
      },
    ],
  }));

  return dataMobile;
}
