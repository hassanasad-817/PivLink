declare module '@transak/transak-sdk' {
  export interface TransakConfig {
    apiKey: string;
    environment?: 'PRODUCTION' | 'STAGING';
    fiatCurrency?: string;
    cryptoCurrencyCode?: string;
    network?: string;
    walletAddress?: string;
    disableWalletAddressForm?: boolean;
    hideMenu?: boolean;
    themeColor?: string;
    isFeeCalculationHidden?: boolean;
    redirectURL?: string;
    widgetHeight?: string;
    widgetWidth?: string;
  }

  export enum EVENTS {
    TRANSAK_ORDER_SUCCESSFUL = 'TRANSAK_ORDER_SUCCESSFUL',
    TRANSAK_ORDER_FAILED = 'TRANSAK_ORDER_FAILED',
    TRANSAK_WIDGET_CLOSE = 'TRANSAK_WIDGET_CLOSE',
  }

  export default class TransakSDK {
    static EVENTS: typeof EVENTS;
    constructor(config: TransakConfig);
    init(): void;
    on(event: string, callback: () => void): void;
    close(): void;
  }
}
