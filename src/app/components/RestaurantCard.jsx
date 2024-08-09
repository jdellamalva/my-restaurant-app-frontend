import Link from 'next/link';
import Image from 'next/image';

const RestaurantCard = ({ restaurant }) => {

    return (
        <div className="w-full p-4">
            <div className="h-full bg-gray-100 rounded-2xl shadow-lg overflow-hidden flex flex-col">
                <Image
                    className="w-full h-48 object-cover"
                    src={restaurant.imageUrl}
                    alt={restaurant.name}
                    width={500}  // You can set an appropriate width based on your layout
                    height={200} // You can set an appropriate height based on your layout
                />
                <div className="p-4 flex flex-col justify-between flex-grow">
                    <div>
                        <h3 className="mb-2 font-heading text-xl text-gray-900 hover:text-gray-700 font-bold">
                            {restaurant.name}
                        </h3>
                        <p className="text-sm text-gray-500 mb-4">
                            {restaurant.description}
                        </p>
                    </div>
                    <div className="flex justify-center mt-auto">
                        <Link
                            className="block px-8 py-2 text-lg text-center text-white font-bold bg-gray-900 hover:bg-gray-800 focus:ring-4 focus:ring-gray-600 rounded-full"
                            href={`/restaurant/${restaurant.restaurantId}`}
                            data-testid="restaurant-card"
                        >
                            View
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RestaurantCard;