import React, { useEffect, useState } from 'react';
import db from './db';
import ProductsList from './components/ProductsList';
import CartDisplay from './components/CartDisplay';

interface Product {
  id: number;
  name: string;
  desctiption: string;
  price: number;
  quantity: number;
  imgUrl: string;
}

interface CheckoutData {
  cardName: string;
  cardNumber: string;
  date: string;
  cvv: string;
}

const initialProducts: Product[] = [
  { id: 1, name: "Italy Pizza", desctiption: 'Extra cheese and toping', price: 681, quantity: 1, imgUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&amp;w=1000&amp;auto=format&amp;fit=crop&amp;ixlib=rb-4.0.3&amp;ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { id: 2, name: "Combo Plate", desctiption: 'Extra cheese and toping', price: 681, quantity: 1, imgUrl: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { id: 3, name: "Spanish Rice", desctiption: 'Extra garllic', price: 681, quantity: 1, imgUrl: "https://images.unsplash.com/photo-1600803907087-f56d462fd26b?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
];
const App = () => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [shippingPrice, setShippingPrice] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);

  useEffect(() => {
    const initializeApp = async () => {
      const shippingCost = await db.getShippingPrice();
      setShippingPrice(shippingCost);
      fetchInitialData();
    };

    initializeApp();
  }, []);

  useEffect(() => {
    const newTotal = calculateTotal(products);
    setTotal(newTotal);
  }, [products]);

  const fetchInitialData = async () => {
    const loadedCartItems = await db.cart.toArray();
    const updatedProducts = initialProducts.map(product => {
      const foundItem = loadedCartItems.find(item => item.id === product.id);
      return { ...product, quantity: foundItem ? foundItem.quantity : 1 };
    });
    setProducts(updatedProducts);
    calculateTotal(updatedProducts);
  };

  const updateCart = async (product: Product, quantity: number) => {
    if (quantity > 0) {
      await db.cart.put({ ...product, quantity });
    } else {
      await db.cart.delete(product.id);
    }
    fetchInitialData();
  };

  const handleIncrease = (product: Product) => {
    const newQuantity = product.quantity + 1;
    updateCart(product, newQuantity);
  };

  const handleDecrease = (product: Product) => {
    if (product.quantity > 1) {
      const newQuantity = product.quantity - 1;
      updateCart(product, newQuantity);
    } else {
      handleRemoveFromCart(product);
    }
  };

  const handleRemoveFromCart = async (product: any) => {
    if (product.quantity > 0) {
      await db.updateCartQuantity(product.id, 0);
      updateProductInState(product.id, 0);
      setTotal(calculateTotal(products));
    }
  };

  const updateProductInState = (productId: any, newQuantity: any) => {
    const updatedProducts = products.map(product => {
      if (product.id === productId) {
        return { ...product, quantity: newQuantity };
      }
      return product;
    });
    setProducts(updatedProducts);
  };

  const calculateTotal = (products: any) => {
    return products.reduce((acc: any, item: any) => acc + item.price * item.quantity, 0);
  };

  const handleCheckout = async (checkoutData: CheckoutData) => {
    const items = products.filter(p => p.quantity > 0).map(p => ({
      id: p.id,
      quantity: p.quantity
    }));


    const order = {
      cardName: checkoutData.cardName,
      cardNumber: checkoutData.cardNumber,
      cardDate: checkoutData.date,
      cvv: checkoutData.cvv,
      total: total,
      items: items,
      date: new Date()
    };

    await db.saveOrder(order).then(() => {
      alert("Saved !!!")
    })


    db.clearCart().then(() => {
      setProducts(products.map(product => ({ ...product, quantity: 1 })));
    });
  };

  return (
    <div className='flex justify-between items-start p-[50px] gap-[50px] w-[1133px] mx-auto'>
      <ProductsList products={products}
        onAddToCart={handleIncrease}
        onRemoveFromCart={handleRemoveFromCart}
        onIncrease={handleIncrease}
        onDecrease={handleDecrease} />
      <CartDisplay shippingPrice={shippingPrice} total={total} onCheckout={handleCheckout} />
    </div>
  );
};

export default App;