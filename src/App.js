import { BrowserRouter, Route, Routes } from "react-router-dom";
import { MainContext } from "./utils/MainContext";
import { useRouter } from "./utils/routes";

function App() {
  const routes = useRouter();

  return (
    <div className="App">
      <MainContext>
        <BrowserRouter>
          <Routes>
            {routes &&
              routes.map((r) => (
                <Route exact key={r.path} path={r.path} element={r.element} />
              ))}
          </Routes>
        </BrowserRouter>
      </MainContext>
    </div>
  );
}

export default App;
