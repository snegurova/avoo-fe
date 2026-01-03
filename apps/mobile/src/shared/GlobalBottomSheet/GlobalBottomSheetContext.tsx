import React, { createContext, useContext, useRef, useState, useCallback, ReactNode } from 'react';
import BottomSheet from '@gorhom/bottom-sheet';
import { GlobalBottomSheet } from './GlobalBottomSheet';

type GlobalBottomSheetContextType = {
  open: (content: ReactNode) => void;
  close: () => void;
};

const GlobalBottomSheetContext = createContext<GlobalBottomSheetContextType | null>(null);

export const useGlobalBottomSheet = () => {
  const context = useContext(GlobalBottomSheetContext);
  if (!context) {
    throw new Error('useGlobalBottomSheet must be used within GlobalBottomSheetProvider');
  }
  return context;
};

type Props = {
  children: ReactNode;
};

export const GlobalBottomSheetProvider = ({ children }: Props) => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [content, setContent] = useState<ReactNode>(null);

  const open = useCallback((newContent: ReactNode) => {
    setContent(newContent);
    bottomSheetRef.current?.expand();
  }, []);

  const close = useCallback(() => {
    bottomSheetRef.current?.close();
    setTimeout(() => setContent(null), 300);
  }, []);

  return (
    <GlobalBottomSheetContext.Provider value={{ open, close }}>
      {children}
      <GlobalBottomSheet ref={bottomSheetRef} content={content} onClose={close} />
    </GlobalBottomSheetContext.Provider>
  );
};

