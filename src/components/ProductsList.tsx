import React from "react";
import { filter } from "lodash";
import { useQuery } from "@tanstack/react-query";

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
 * Custom hook to fetch products data
 * @returns {data, loading, error, refresh}
 */
export function useProducts(brand: string) {
  const {
    data,
    isLoading: loading,
    error,
    refetch: refresh,
  } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const response = await fetch(API_URL);
      const data = (await response.json()) as ProductsApiResponseData;
      return filter(data.products, { brand });
    },
    enabled: !!brand,
  });

  return { data, loading, error, refresh };
}

export const ProductsList = ({ brand }: { brand: string }) => {
  const { data, loading, error, refresh } = useProducts(brand);

  if (loading || !data)
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
          <button
            className="p-3 py-1 rounded-md bg-gray-200"
            onClick={() => refresh()}
          >
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
