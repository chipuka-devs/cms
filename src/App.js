import { Provider } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { AnalysisContext } from "./utils/AnalysisContext";
import { MainContext } from "./utils/MainContext";
import { useRouter } from "./utils/routes";
import { store } from "./redux/Store";

function App() {
  const routes = useRouter();

  return (
    <div className="App">
      <MainContext>
        <Provider store={store}>
          <AnalysisContext>
            <BrowserRouter>
              <Routes>
                {routes &&
                  routes.map((r) => (
                    <Route
                      exact
                      key={r.path}
                      path={r.path}
                      element={r.element}
                    />
                  ))}
              </Routes>
            </BrowserRouter>
          </AnalysisContext>
        </Provider>
      </MainContext>
    </div>
  );
}

export default App;
