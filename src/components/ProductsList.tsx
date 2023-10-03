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
  skip: number;
  total: number;
};

/**
 * Retry API call if it fails based on number of retry attempts
 * @param url
 * @param retryAttempt
 */
const retryApiCall = async (
  url: string,
  retryAttempt = 2,
): Promise<ProductsApiResponseData> => {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data as ProductsApiResponseData;
  } catch (error) {
    if (retryAttempt === 0) {
      throw new Error((error as Error).message);
    }
    return retryApiCall(url, retryAttempt - 1);
  }
};

export const ProductsList = () => {
  const [data, setData] = useState<Product[] | undefined>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | undefined>();

  useEffect(() => {
    setLoading(true);
    // timeout to simulate delay
    setTimeout(() => {
      retryApiCall("https://dummyjson.com/products", 2)
        .then((data: ProductsApiResponseData) => {
          setData(data.products);
          setLoading(false);
        })
        .catch((error: Error) => setError(error))
        .finally(() => setLoading(false));
    }, 1000);
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
