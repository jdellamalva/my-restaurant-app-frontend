import { useAppContext } from "../context/AppContext";
import CartItem from "./CartItem"; // Import the CartItem component
import formatUSD from "../utils/formatUSD";

export default function CheckoutCart() {
    const { user, clearCart } = useAppContext();
    const cart = user.cart;
    const total = cart.reduce((sum, item) => sum + item.dish.price * item.quantity, 0);
    const displayTotal = formatUSD(total / 100);

    return (
        <div className="rounded-2xl co bg-gray-800" data-testid="checkout-cart">
            <div className="max-w-lg pt-6 pb-8 px-8 mx-auto bg-blueGray-900">
                <div className="flex mb-10 items-center justify-between">
                    <h6 className="font-bold text-2xl text-white mb-0">Your Cart</h6>
                </div>

                <div>
                    {cart.length > 0 ? (
                        cart.map((item, index) => {
                            if (item.quantity > 0) {
                                return <CartItem key={item.dish._id} data={item} />;
                            }
                        })
                    ) : (
                        <p className="text-white">Your cart is empty</p>
                    )}
                </div>
                <div className="p-6">
                    <div className="flex mb-6 content-center justify-between">
                        <span className="font-bold text-white">Order total</span>
                        <span className="text-sm font-bold text-white" data-testid="cart-total">
                            {displayTotal}
                        </span>
                    </div>
                    <button
                        onClick={clearCart}
                        className="mt-4 inline-block w-full text-center font-bold text-gray-400 hover:text-gray-200 transition duration-200"
                        data-testid="clear-cart-button"
                    >
                        Reset Cart
                    </button>
                </div>
            </div>
        </div>
    );
}