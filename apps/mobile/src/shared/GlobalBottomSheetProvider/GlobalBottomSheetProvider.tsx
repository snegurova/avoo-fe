import { createContext, useContext, useRef, useState, useCallback, ReactNode } from 'react';
import BottomSheet from '@gorhom/bottom-sheet';
import { GlobalBottomSheet } from '../GlobalBottomSheet/GlobalBottomSheet';

type GlobalBottomSheetContextType = {
  handleOpenBottomSheet: (content: ReactNode) => void;
  handleCloseBottomSheet: () => void;
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

  const handleOpenBottomSheet = useCallback((newContent: ReactNode) => {
    setContent(newContent);
    bottomSheetRef.current?.expand();
  }, []);

  const handleCloseBottomSheet = useCallback(() => {
    bottomSheetRef.current?.close();
  }, []);

  return (
    <GlobalBottomSheetContext.Provider value={{ handleOpenBottomSheet, handleCloseBottomSheet }}>
      {children}
      <GlobalBottomSheet ref={bottomSheetRef} content={content} onClose={handleCloseBottomSheet} />
    </GlobalBottomSheetContext.Provider>
  );
};

