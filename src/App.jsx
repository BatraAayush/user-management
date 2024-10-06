import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./pages/Layout";
import Home from "./pages/Home";
import UserForm from "./pages/UserForm";
import UserDetails from "./pages/UserDetails";
import NotFound from "./pages/NotFOund";

function App() {
  return (
    <BrowserRouter>
      <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="create-user" element={<UserForm />} />
            <Route path="/edit-user/:id" element={<UserForm />} />
            <Route path="user/:id" element={<UserDetails />} />
          </Route>
          <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
