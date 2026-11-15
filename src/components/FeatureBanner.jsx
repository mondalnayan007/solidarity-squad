
import { useEffect, useState } from 'react';
import * as LottieModule from 'lottie-react';

const Lottie = LottieModule.default.default;

const features = [
  {
    file: '/trusted.json',
    title: '100% Original',
    description: 'All Products Sourced Directly',
  },
  {
    file: '/truck.json',
    title: 'Free Shipping',
    description: 'On Orders Above ৳5000',
  },
  {
    file: '/delivery.json',
    title: 'Cash On Delivery',
    description: 'Order Now, Pay on Delivery',
  },
  {
    file: '/payment.json',
    title: 'Digital Payments',
    description: 'via bKash • Nagad • SSLCommerz',
  },
];

const FeatureBanner = () => {
  const [animations, setAnimations] = useState([]);

  useEffect(() => {
    const loadAnimations = async () => {
      try {
        const data = await Promise.all(
          features.map(async (feature) => {
            const response = await fetch(feature.file);

            if (!response.ok) {
              throw new Error(
                `Failed to load ${feature.file}: ${response.status}`
              );
            }

            return response.json();
          })
        );

        setAnimations(data);
      } catch (error) {
        console.error('Lottie loading error:', error);
      }
    };

    loadAnimations();
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 my-8">
      {features.map((feature, index) => (
        <div
          key={feature.file}
          className="flex items-center justify-center gap-3 py-6 px-3 shadow-xl"
        >
          <div className="w-28 h-28 flex-shrink-0">
            {animations[index] && (
              <Lottie
                animationData={animations[index]}
                loop={true}
                autoplay={true}
                style={{
                  width: '100%',
                  height: '100%',
                }}
              />
            )}
          </div>

          <div>
            <h3 className="text-xl font-semibold text-gray-600">
              {feature.title}
            </h3>

            <p className="text-xs text-gray-400 font-bold mt-2">
              {feature.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FeatureBanner;
