import { BrowserRouter, Routes, Route } from "react-router-dom";
import UserTable from "./components/UserTable";
import UserPosts from "./components/UserPosts";

function App(): JSX.Element {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<UserTable />} />
        <Route path="/user/:userId/posts" element={<UserPosts />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
