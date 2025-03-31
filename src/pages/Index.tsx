
import { Navigate } from "react-router-dom";

const Index = () => {
  // This component simply redirects to the dashboard
  return <Navigate to="/" replace />;
};

export default Index;
