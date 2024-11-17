import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import { UserProvider } from "./context/UserContext";
import Home from "./components/Home";
import TopicPage from "./components/TopicPage";
import ExplorePage from "./components/ExplorePage";
import CreateTopic from "./components/CreateTopic";

export default function App() {
  return (
    <UserProvider>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/talkingpoints" element={<ExplorePage />} />
          <Route path="/talkingpoints/:id" element={<TopicPage />} />
          <Route path="/createtalkingpoint" element={<CreateTopic />} />
        </Routes>
      </main>
    </UserProvider>
  );
}
