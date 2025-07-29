import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Header from "./Components/Header/Header";
import Content from "./Components/Content/Content";
import Footer from "./Components/Footer/Footer";
import Call_center from "./Components/Features/Call_center/Call_center";
import SearchByCate from "./Components/Features/ProductSearch/Cate";
import UserSearch from "./Components/Features/ProductSearch/UserSearch";
import NotFound from "./Components/Features/NotFound/NotFound";

function App() {
  return (
    <Router>
      <div style={{ background: "#f4f1ea" }}>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Header />
                <Content />
                <Footer />
              </>
            }
          />
          <Route
            path="/productByCate"
            element={
              <>
                <Header />
                <SearchByCate />
                <Footer />
              </>
            }
          />

          <Route
            path="/userSearch"
            element={
              <>
                <Header />
                <UserSearch />
                <Footer />
              </>
            }
          />
          <Route path="/notFile" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
