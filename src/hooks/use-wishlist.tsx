import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface WishlistItem {
  issueId: string;
  addedAt: string;
}

interface WishlistData {
  items: WishlistItem[];
  shareEnabled: boolean;
  shareToken: string | null;
}

interface WishlistContextType {
  items: WishlistItem[];
  isInWishlist: (issueId: string) => boolean;
  addToWishlist: (issueId: string) => void;
  removeFromWishlist: (issueId: string) => void;
  toggleWishlist: (issueId: string) => void;
  shareEnabled: boolean;
  shareToken: string | null;
  enableSharing: () => string;
  disableSharing: () => void;
  regenerateShareToken: () => string;
}

const WishlistContext = createContext<WishlistContextType | null>(null);

const STORAGE_KEY = "fang-fleece-wishlist";

const generateToken = (): string => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

const loadWishlistData = (): WishlistData => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error("Failed to load wishlist:", e);
  }
  return { items: [], shareEnabled: false, shareToken: null };
};

const saveWishlistData = (data: WishlistData): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error("Failed to save wishlist:", e);
  }
};

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<WishlistData>(loadWishlistData);

  useEffect(() => {
    saveWishlistData(data);
  }, [data]);

  const isInWishlist = (issueId: string): boolean => {
    return data.items.some(item => item.issueId === issueId);
  };

  const addToWishlist = (issueId: string): void => {
    if (!isInWishlist(issueId)) {
      setData(prev => ({
        ...prev,
        items: [...prev.items, { issueId, addedAt: new Date().toISOString() }]
      }));
    }
  };

  const removeFromWishlist = (issueId: string): void => {
    setData(prev => ({
      ...prev,
      items: prev.items.filter(item => item.issueId !== issueId)
    }));
  };

  const toggleWishlist = (issueId: string): void => {
    if (isInWishlist(issueId)) {
      removeFromWishlist(issueId);
    } else {
      addToWishlist(issueId);
    }
  };

  const enableSharing = (): string => {
    const token = data.shareToken || generateToken();
    setData(prev => ({
      ...prev,
      shareEnabled: true,
      shareToken: token
    }));
    return token;
  };

  const disableSharing = (): void => {
    setData(prev => ({
      ...prev,
      shareEnabled: false,
      shareToken: null
    }));
  };

  const regenerateShareToken = (): string => {
    const token = generateToken();
    setData(prev => ({
      ...prev,
      shareToken: token
    }));
    return token;
  };

  return (
    <WishlistContext.Provider value={{
      items: data.items,
      isInWishlist,
      addToWishlist,
      removeFromWishlist,
      toggleWishlist,
      shareEnabled: data.shareEnabled,
      shareToken: data.shareToken,
      enableSharing,
      disableSharing,
      regenerateShareToken
    }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = (): WishlistContextType => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
};

// Helper to get shared wishlist data (for public page)
export const getSharedWishlist = (token: string): WishlistItem[] | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const data: WishlistData = JSON.parse(stored);
      if (data.shareEnabled && data.shareToken === token) {
        return data.items;
      }
    }
  } catch (e) {
    console.error("Failed to load shared wishlist:", e);
  }
  return null;
};
