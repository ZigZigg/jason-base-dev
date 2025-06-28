import { notification } from 'antd';
import { NotificationInstance } from 'antd/es/notification/interface';
import { createContext } from 'react';

interface ContextProps {
  api: NotificationInstance | null;
}

interface ProviderProps {
  children: React.ReactNode;
}

const NotificationContext = createContext<ContextProps>({ api: null });

export const NotificationProvider = ({ children }: ProviderProps) => {
  const [api, contextHolder] = notification.useNotification();
  return (
    <NotificationContext.Provider value={{ api }}>
      {contextHolder}
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;
