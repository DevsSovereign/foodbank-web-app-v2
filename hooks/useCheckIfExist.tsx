/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect, useCallback } from "react";

interface Props<T> {
  itemList: Record<string, T>[];
}

const useCheckIfExist = <T,>({ itemList }: Props<T>) => {
  const [itemIds, setItemIds] = useState<Set<string>>(() => new Set());

  const checkExist = useCallback(() => {
    if (!itemList) return;

    const ItemSetIds = new Set<string>();

    for (const item of itemList ?? []) {
      // productId would always work for wishlists.
      const productId = item.productId || item._id;
      if (!productId) return;

      ItemSetIds.add(productId as string);
    }

    setItemIds(ItemSetIds);
  }, [itemList]);

  useEffect(() => {
    checkExist();
  }, [checkExist]);

  return { itemIds, setItemIds };
};

export default useCheckIfExist;
