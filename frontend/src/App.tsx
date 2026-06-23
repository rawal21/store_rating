import { BrowserRouter } from "react-router-dom";

// Routes will be added in Phase 2
const App = () => {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-primary-600 dark:text-primary-400">
            Store Rating
          </h1>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            Phase 1 complete — infrastructure ready
          </p>
        </div>
      </div>
    </BrowserRouter>
  );
};

export default App;
