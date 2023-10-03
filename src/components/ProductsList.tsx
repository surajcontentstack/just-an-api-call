import React, { useEffect, useState } from "react";

type Product = {
  id: number;
  title: string;
  thumbnail: string;
  description: string;
  price: number;
  rating: number;
};

type ProductsApiResponseData = {
  products: Product[];
  limit: number;
};

export const ProductsList = () => {
  const [data, setData] = useState<Product[] | undefined>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | undefined>();

  useEffect(() => {
    setLoading(true);
    // timeout to simulate delay
    setTimeout(() => {
      fetch("https://dummyjson.com/productss")
        .then((response) => response.json())
        .then((data: ProductsApiResponseData) => {
          setData(data.products as Product[]);
          setLoading(false);
        })
        .catch((error) => setError(error))
        .finally(() => setLoading(false));
    }, 2000);
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error)
    return <div className="text-red-400">Error: Something went wrong.</div>;

  return (
    <div>
      <h2 className="font-bold mb-3">Products:</h2>
      <div>
        {React.Children.toArray(
          data?.map((item: Product) => (
            <div className="bg-white border rounded-md p-2 my-4 flex items-center">
              <img
                alt={item.title}
                src={item.thumbnail}
                className="w-20 h-20 object-cover mr-4"
              />
              <div>
                <h2 className="text-xl font-bold mb-2">{item.title}</h2>
                <p className="text-gray-700 mb-2">{item.description}</p>
                <p className="text-green-600 font-bold">${item.price}</p>
              </div>
            </div>
          )),
        )}
      </div>
    </div>
  );
};
