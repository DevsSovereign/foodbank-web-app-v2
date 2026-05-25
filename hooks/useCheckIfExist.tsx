import { useMemo, useRef, useState } from "react";

interface Props<T> {
  itemList: Record<string, T>[];
}
/**add to a wishlist and Set with the id of the product. Delete from wishlist with the wishlist object id
 * */
const useCheckIfExist = <T,>({ itemList }: Props<T>) => {
  // Build a content-based key so we don't recompute when callers pass a fresh [] every render.
  const idKey = itemList
    ? itemList.map((item) => (item.productId ?? item._id) as string).join("|")
    : "";

  const derivedIds = useMemo(() => {
    const ids = new Set<string>();

    if (!itemList) return ids;

    for (const item of itemList) {
      const productId = (item.productId ?? item._id) as string | undefined;
      if (!productId) continue;
      ids.add(productId);
    }
    return ids;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idKey]);

  const [itemIds, setItemIds] = useState<Set<string>>(derivedIds);

  // Sync state when the derived Set actually changes (e.g. data refetched),
  // but leave optimistic updates from setItemIds untouched between server changes.
  const prevDerivedRef = useRef(derivedIds);
  if (prevDerivedRef.current !== derivedIds) {
    prevDerivedRef.current = derivedIds;
    setItemIds(derivedIds);
  }

  return { itemIds, setItemIds };
};

export default useCheckIfExist;
