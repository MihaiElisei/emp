import { useState, useEffect } from "react";
import BeatLoader from "react-spinners/BeatLoader";

const Spinner = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const darkMode = JSON.parse(localStorage.getItem("dark")) || false;
    setIsDarkMode(darkMode);
  }, []);

  return (
    <div className="flex justify-center items-center h-screen w-screen bg-zinc-100 dark:bg-zinc-900">
      <BeatLoader
        size={10}
        color={isDarkMode ? "#F4F4F5" : "#18181B"}
        loading={true}
      />
    </div>
  );
};

export default Spinner;
