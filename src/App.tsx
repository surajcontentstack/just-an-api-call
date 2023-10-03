import { ProductsList } from "./components/ProductsList.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="grid grid-cols-2 lg:grid-cols-4">
        <div className="p-4">
          <ProductsList brand={"Apple"} />
        </div>
        <div className="p-4">
          <ProductsList brand={"Samsung"} />
        </div>
      </div>
    </QueryClientProvider>
  );
}

export default App;
