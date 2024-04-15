import React, { useState } from 'react';
import user from '../assets/images/User.png';
import visa from '../assets/images/visa.png'
import mastercard from '../assets/images/mastercard.png'
import rupay from '../assets/images/rupay.png'
import { InputMask } from "primereact/inputmask"


interface Props {
    shippingPrice: number;
    total: number;
    onCheckout: (checkoutData: CheckoutData) => void;
}

interface CheckoutData {
    cardName: string;
    cardNumber: string;
    date: string;
    cvv: string;
}

const titleStyle = {
    fontSize: '16px',
    marginBottom: '5px'
}

const inputStyle = {
    width: '100%',
    background: '#6268C6',
    paddingTop: "12px",
    paddingBottom: "12px",
    paddingRight: "20px",
    paddingLeft: "20px",
    borderRadius: '6px',
    fontSize: '12px'
}

const CartDisplay: React.FC<Props> = ({ shippingPrice, total, onCheckout }) => {
    const [checkoutData, setCheckoutData] = useState<CheckoutData>({ cardName: '', cardNumber: '', date: '', cvv: '' });
    const [submitAttempted, setSubmitAttempted] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCheckoutData(prevState => ({ ...prevState, [name]: value }));
    };

    const handleCheckout = () => {
        if (checkoutData.cardName && checkoutData.cardNumber && checkoutData.date && checkoutData.cvv) {
            onCheckout(checkoutData);
            setCheckoutData({ cardName: '', cardNumber: '', date: '', cvv: '' });
            setSubmitAttempted(false);
        } else {
            setSubmitAttempted(true);
        }
    };

    return (
        <div className='w-2/5 bg-[#565ABB] p-5 text-white rounded-[20px]'>
            <div className='flex justify-between items-center pb-[5px]'>
                <h1 className='text-2xl font-semibold'>Card Details </h1>
                <img src={user} className='w-[50px] h-[50px]' alt="" />
            </div>
            <div className='mb-6'>
                <h2 style={titleStyle}>Card type</h2>
                <div className='flex justify-between'>
                    <img src={mastercard} alt="" />
                    <img src={visa} alt="" />
                    <img src={rupay} alt="" />
                    <div className='flex justify-center items-center w-[75px] h-[55px] rounded-md' style={{ background: 'rgba(217, 217, 217, 0.2)' }}>
                        See all
                    </div>
                </div>
            </div>

            <div className='mb-4'>
                <h2 style={titleStyle}>Name on card</h2>
                <input required name="cardName" type="text" placeholder='Name' style={inputStyle} className=' focus:outline-none' value={checkoutData.cardName} onChange={handleChange} />
            </div>
            <div className='mb-4'>
                <h2 style={titleStyle}>Card Number</h2>
                <InputMask required name="cardNumber" mask='9999 9999 9999 9999' style={inputStyle} placeholder='1111 2222 3333 4444' className='focus:outline-none' value={checkoutData.cardNumber} onChange={(e: any) => handleChange(e)} />
            </div>
            <div className='flex gap-2 pb-5 border-b-[1px] border-b-[#5F65C3]'>
                <div>
                    <h2 style={titleStyle}>Expiration date</h2>
                    <InputMask required name="date" mask='99/99' style={inputStyle} placeholder='mm/yy' className='focus:outline-none' value={checkoutData.date} onChange={(e: any) => handleChange(e)} />
                </div>
                <div>

                    <h2 style={titleStyle}>CVV</h2>
                    <InputMask required name="cvv" mask='999' style={inputStyle} placeholder='123' className='focus:outline-none' value={checkoutData.cvv} onChange={(e: any) => handleChange(e)} />
                </div>
            </div>
            <div className='pt-4 pb-6'>
                <p className='flex justify-between items-center'><span>Subtotal</span> <span>${total}</span></p>
                <p className='flex justify-between items-center'><span>Shipping</span> <span>${shippingPrice}</span></p>
                <p className='flex justify-between items-center'><span>Total (Tax incl.)</span> <span>${shippingPrice + total}</span></p>
            </div>
            <button onClick={handleCheckout} className='rounded-xl bg-[#4DE1C1] flex justify-between items-center w-full px-6 py-[18px]'> <span>${shippingPrice + total}</span><span>Checkout &rarr;</span></button>
            {submitAttempted && (!checkoutData.cardName || !checkoutData.cardNumber || !checkoutData.date || !checkoutData.cvv) && (
                <p className='mt-2' style={{ color: 'red' }}>Please fill in all fields.</p>
            )}
        </div>
    );
};

export default CartDisplay;
