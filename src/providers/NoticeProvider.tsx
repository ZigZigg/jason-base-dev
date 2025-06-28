import { createContext, useContext, useState, ReactNode, FC } from 'react';
import CommonNotice, { CommonNoticeProps } from '../atomics/Notice';

interface NoticeContextProps {
  openModal: (props: CommonNoticeProps) => void;
  closeModal: () => void;
  width?: number;
}

const NoticeContext = createContext<NoticeContextProps | undefined>(undefined);

interface NoticeProviderProps {
  children?: ReactNode;
}

export const NoticeProvider: FC<NoticeProviderProps> = ({ children }) => {
  const [noticeProps, setNoticeProps] = useState<CommonNoticeProps>({
    description: 'Default Description',
  });

  const openModal = (props: CommonNoticeProps) => {
    setNoticeProps({ ...noticeProps, ...props, open: true });
  };

  const closeModal = () => {
    setNoticeProps({ ...noticeProps, open: false });
  };

  return (
    <NoticeContext.Provider value={{ openModal, closeModal }}>
      {children}
      <CommonNotice {...noticeProps} />
    </NoticeContext.Provider>
  );
};

export const useNotice = () => {
  const context = useContext(NoticeContext);
  if (!context) {
    throw new Error('useNotice must be used within a NoticeProvider');
  }
  return context;
};
