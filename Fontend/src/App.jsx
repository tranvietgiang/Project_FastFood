import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Header from "./Components/Header/Header";
import Content from "./Components/Content/Content";
import Footer from "./Components/Footer/Footer";
import SearchByCate from "./Components/Features/ProductSearch/Cate";
import UserSearch from "./Components/Features/ProductSearch/UserSearch";
import NotFound from "./Components/Features/NotFound/NotFound";
import Section_1 from "./Components/Content/Section_1";
import ShowAllSection_3 from "./Components/PageOther/ShowAllSection3";
import ItemDetail from "./Components/PageOther/ItemDetail/ItemDetail";

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

          <Route
            path="/section3/showAll"
            element={
              <>
                <Header />
                <span className="hidden md:block">
                  <Section_1 />
                </span>
                <ShowAllSection_3 />
                <Footer />
              </>
            }
          />

          <Route
            path="/item/detail/:slug"
            element={
              <>
                <Header />
                <ItemDetail />
                <Footer />
              </>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
