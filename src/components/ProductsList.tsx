import React from 'react';
import increase from "../assets/icons/RectangleUp.png";
import decrease from "../assets/icons/RectangleDown.png";
import trash from "../assets/icons/TrashCan.png"

interface Product {
    id: number;
    name: string;
    desctiption: string;
    price: number;
    imgUrl: string;
    quantity: number;
}

interface Props {
    products: Product[];
    onAddToCart: (product: Product) => void;
    onRemoveFromCart: (product: Product) => void;
    onIncrease: (product: Product) => void;
    onDecrease: (product: Product) => void;
}

const ProductsList: React.FC<Props> = ({ products, onAddToCart, onRemoveFromCart, onIncrease, onDecrease }) => {
    return (
        <div className='w-3/5 text-[#1E1E1E]'>
            <h1 className='text-lg font-semibold border-b-2 py-5 border-[#D0CFCF]'> &lt; Shopping Continue</h1>
            <div className='header py-6'>
                <h1 className='text-lg font-medium'>Shopping cart</h1>
                <p className='text-sm'>You have {products.length} item in your cart</p>
            </div>
            {products.map(product => (
                <div key={product.id} className='p-2.5 rounded-2xl mb-6 flex justify-between items-center' style={{ boxShadow: '1px 0 4px rgba(0, 0, 0, 0.25)' }}>
                    <div className='w-3/5 flex items-center'>
                        <img src={product.imgUrl} alt={product.name} className='w-20 h-20 rounded-lg mr-5' />
                        <div>
                            <h1>
                                {product.name}
                            </h1>
                            <p>
                                {product.desctiption}
                            </p>
                        </div>
                    </div>
                    <div className='flex justify-between w-2/5'>
                        <div className='flex items-center gap-2'>
                            <h1>{product.quantity}</h1>
                            <div className='flex flex-col gap-0.5'>
                                <button onClick={() => onIncrease(product)}> <img src={increase} alt='' /> </button>
                                <button onClick={() => onDecrease(product)} disabled={product.quantity === 0}>  <img src={decrease} alt='' /> </button>
                            </div>
                        </div>
                        <p>${product.price}</p>
                        <button onClick={() => onRemoveFromCart(product)} disabled={product.quantity === 0}> <img className='w-[25px] h-[25px]' src={trash} alt='' /> </button>
                    </div>
                </div>
            ))
            }
        </div >
    );
};

export default ProductsList;
