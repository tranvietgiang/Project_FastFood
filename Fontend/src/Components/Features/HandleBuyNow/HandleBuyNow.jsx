export const handleBuyNow = ({
  getProduct,
  priceDiscount,
  priceVariantPrice,
  quantity,
  selectVariants,
  noteOrder,
  quantityRef,
  priceRef,
  nameRef,
  navigate,
}) => {
  if (quantityRef.current?.innerText != quantity) {
    navigate("/notFile");
    return;
  }

  let finalName = getProduct?.first?.product_name || getProduct?.product_name;
  let finalPrice = priceDiscount || getProduct?.product_price;

  if (nameRef.current?.innerText.trim() !== finalName.trim()) {
    navigate("/notFile");
    return;
  }

  if (selectVariants !== "") {
    finalName = selectVariants;
    finalPrice = priceVariantPrice || finalPrice;
  }

  if (priceRef.current.textContent != Number(finalPrice).toLocaleString()) {
    navigate("/notFile");
    return;
  }

  const newPackage = {
    idOrder: getProduct?.first?.product_id || getProduct?.product_id,
    nameOrder: finalName,
    priceOrder: Number(finalPrice).toFixed(2),
    quantityOrder: quantity,
    noteOrder: noteOrder || "",
    imageOrder: getProduct?.product_image || getProduct?.first?.product_image,
  };

  localStorage.setItem("packageOrder", JSON.stringify(newPackage));
  navigate("/information-orders");
};
