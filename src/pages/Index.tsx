
import { Navigate } from "react-router-dom";

const Index = () => {
  // This component redirects to the performance page to test the charts
  return <Navigate to="/performance" replace />;
};

export default Index;
