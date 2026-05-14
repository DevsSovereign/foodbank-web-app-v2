import { useState, useEffect } from "react";

interface Props<T> {
  itemList: Record<string, T>[];
}
/**add to a wishlist and Set with the id of the product. Delete from wishlist with the wishlist object id
 * */
const useCheckIfExist = <T,>({ itemList }: Props<T>) => {
  const [itemIds, setItemIds] = useState<Set<string>>(() => new Set());

  useEffect(() => {
    if (!itemList) return;

    const checkExist = () => {
      const ItemSetIds = new Set<string>();

      for (const item of itemList) {
        /* productId would always work for wishlists. */
        const productId = item.productId || item._id;
        if (!productId) return;

        ItemSetIds.add(productId as string);
      }

      setItemIds(ItemSetIds);
    };

    checkExist();
  }, [itemList]);

  return { itemIds, setItemIds };
};

export default useCheckIfExist;
