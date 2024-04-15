import Dexie from 'dexie';

interface CartItem {
    id: number;
    quantity: number;
}

interface ShippingInfo {
    id: number;
    price: number;
}

interface Order {
    id?: number;
    cardName: string;
    cardNumber: string;
    cardDate: string;
    cvv: string;
    total: number;
    items: CartItem[];
    date: Date;
}

class MyDatabase extends Dexie {
    public cart: Dexie.Table<CartItem, number>;
    public shipping!: Dexie.Table<ShippingInfo, number>;
    public orders: Dexie.Table<Order, number>;

    constructor() {
        super("MyEcommerceDB");
        this.version(1).stores({
            cart: 'id, quantity',
            shipping: 'id, price',
            orders: '++id, cardName, cardNumber, cardDate, cvv, total, items, date'
        });

        this.cart = this.table("cart");
        this.shipping = this.table("shipping");
        this.orders = this.table("orders");
    }

    async fetchAllCartItems(): Promise<CartItem[]> {
        return this.cart.toArray();
    }

    async updateCartQuantity(productId: number, quantity: number) {
        if (quantity > 0) {
            await this.cart.put({ id: productId, quantity });
        } else {
            await this.cart.delete(productId);
        }
    }

    async saveOrder(order: Order): Promise<number> {
        return await this.orders.add(order);
    }

    async getShippingPrice(): Promise<number> {
        const shipping = await this.shipping.toArray();
        return shipping.length > 0 ? shipping[0].price : 10;  // Ensure there is a default shipping price
    }

    async clearCart() {
        await this.cart.clear();
    }
}

const db = new MyDatabase();

export default db;
