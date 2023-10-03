import React, { useEffect, useState } from "react";
import { filter } from "lodash";

type Product = {
  brand: string;
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

/**
 * Custom hook to fetch products data
 * @returns {data, loading, error}
 */
function useProducts(brand: string) {
  const [data, setData] = useState<Product[] | undefined>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | undefined>();

  useEffect(() => {
    refresh();
  }, []);

  const refresh = () => {
    setLoading(true);
    setError(undefined);
    retryApiCall("https://dummyjson.com/products", 2)
      .then((data: ProductsApiResponseData) => {
        setData(filter(data.products, { brand }));
        setLoading(false);
      })
      .catch((error: Error) => setError(error))
      .finally(() => setLoading(false));
  };

  return { data, loading, error, refresh };
}

export const ProductsList = ({ brand }: { brand: string }) => {
  const { data, loading, error, refresh } = useProducts(brand);

  if (loading)
    return (
      <div className={"border border-gray-200 p-3 rounded-md"}>
        <div>Loading...</div>
      </div>
    );
  if (error)
    return (
      <div className={"border border-gray-200 p-3 rounded-md"}>
        <div className="text-red-400">Error: Something went wrong.</div>
        <p>
          <button className="p-3 py-1 rounded-md bg-gray-200" onClick={refresh}>
            Retry
          </button>
        </p>
      </div>
    );

  return (
    <div className={"border border-gray-200 p-3 rounded-md"}>
      <h2 className="font-bold mb-3">{brand} Products:</h2>
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
