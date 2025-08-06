import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const Loading = () => {
  const { path } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (path) {
      const timer = setTimeout(() => {
        navigate(`/${path}`);
      }, 5000);

      // Cleanup the timer on component unmount
      return () => clearTimeout(timer);
    }
  }, [path, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="w-16 sm:w-20 aspect-square border-4 border-gray-300 border-t-4 border-t-blue-400 rounded-full animate-spin mb-4"></div>
      <p className="text-gray-600 text-lg">Loading...</p>
      {path && (
        <p className="text-gray-500 text-sm mt-2">Redirecting to {path}...</p>
      )}
    </div>
  );
};

export default Loading;
