import { ProductsList } from "./components/ProductsList.tsx";

function App() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4">
      <div className="p-4">
        <ProductsList />
      </div>
    </div>
  );
}

export default App;
