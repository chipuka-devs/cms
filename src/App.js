import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AnalysisContext } from "./utils/AnalysisContext";
import { MainContext } from "./utils/MainContext";
import { useRouter } from "./utils/routes";

function App() {
  const routes = useRouter();

  return (
    <div className="App">
      <MainContext>
        <AnalysisContext>
          <BrowserRouter>
            <Routes>
              {routes &&
                routes.map((r) => (
                  <Route exact key={r.path} path={r.path} element={r.element} />
                ))}
            </Routes>
          </BrowserRouter>
        </AnalysisContext>
      </MainContext>
    </div>
  );
}

export default App;
