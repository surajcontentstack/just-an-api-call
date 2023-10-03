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
 * API URL
 */
const API_URL = "https://dummyjson.com/products";

/**
 * Global data store
 */
const GLOBAL_DATA: {
  [url: string]: {
    state: "NOT_FETCHED" | "FETCHING" | "COMPLETE";
    data?: ProductsApiResponseData;
  };
} = {};

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
    const data = (await response.json()) as ProductsApiResponseData;
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
 * @returns {data, loading, error, refresh}
 */
function useProducts(brand: string) {
  const [data, setData] = useState<Product[] | undefined>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | undefined>();

  useEffect(() => {
    refresh();
  }, []);

  const refresh = () => {
    if (GLOBAL_DATA[API_URL]?.state === "COMPLETE") {
      setData(filter(GLOBAL_DATA[API_URL].data?.products, { brand }));
      setLoading(false);
      setError(undefined);
      return;
    }

    if (GLOBAL_DATA[API_URL]?.state === "FETCHING") {
      setTimeout(() => refresh(), 1000);
      return;
    }
    GLOBAL_DATA[API_URL] = { state: "FETCHING", data: undefined };
    setLoading(true);
    setError(undefined);
    retryApiCall(API_URL, 2)
      .then((data: ProductsApiResponseData) => {
        GLOBAL_DATA[API_URL] = { state: "COMPLETE", data };
        setData(filter(data.products, { brand }));
        setLoading(false);
      })
      .catch((error: Error) => {
        GLOBAL_DATA[API_URL] = { state: "NOT_FETCHED", data: undefined };
        setError(error);
      })
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
