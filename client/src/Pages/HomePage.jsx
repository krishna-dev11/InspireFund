import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import LoginForm from "../Components/Core/Auth/LoginForm";

function HomePage() {
  const { token } = useSelector((state) => state.auth);

  if (token) return <Navigate to="/dashboard" />;
  return <LoginForm defaultTab="login" />;
}

export default HomePage;
