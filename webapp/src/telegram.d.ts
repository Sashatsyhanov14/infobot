interface Window {
  Telegram?: {
    WebApp: {
      initData: string;
      initDataUnsafe: {
        query_id: string;
        user?: {
          id: number;
          first_name: string;
          last_name?: string;
          username?: string;
          language_code?: string;
          is_premium?: boolean;
          allows_write_to_pm?: boolean;
        };
        auth_date: string;
        hash: string;
        [key: string]: any;
      };
      expand: () => void;
      close: () => void;
      sendData: (data: string) => void;
      showAlert: (message: string) => void;
      showConfirm: (message: string, callback: (confirmed: boolean) => void) => void;
      MainButton: {
        text: string;
        color: string;
        textColor: string;
        isVisible: boolean;
        isActive: boolean;
        show: () => void;
        hide: () => void;
        enable: () => void;
        disable: () => void;
        onClick: (callback: () => void) => void;
        offClick: (callback: () => void) => void;
      };
      [key: string]: any;
    };
  };
}
