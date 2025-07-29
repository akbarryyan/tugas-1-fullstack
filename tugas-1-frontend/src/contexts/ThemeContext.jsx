import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem("theme");
    return saved || "light"; // Default to light for easier testing
  });

  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const updateTheme = () => {
      console.log("Updating theme:", theme);
      const html = document.documentElement;

      // Simple theme switching - let Tailwind handle styling
      if (theme === "system") {
        const systemDark = window.matchMedia(
          "(prefers-color-scheme: dark)"
        ).matches;
        console.log("System dark mode:", systemDark);
        setIsDark(systemDark);

        if (systemDark) {
          html.classList.add("dark");
        } else {
          html.classList.remove("dark");
        }
      } else if (theme === "dark") {
        console.log("Setting dark mode: true");
        setIsDark(true);
        html.classList.add("dark");
      } else if (theme === "light") {
        console.log("Setting light mode: true");
        setIsDark(false);
        html.classList.remove("dark");
      }

      // Debug info
      console.log("HTML classes after update:", html.className);
      console.log(
        "HTML element has 'dark' class:",
        html.classList.contains("dark")
      );
      console.log(
        "Body computed background:",
        window.getComputedStyle(document.body).backgroundColor
      );
      console.log(
        "HTML computed background:",
        window.getComputedStyle(html).backgroundColor
      );

      console.log("Theme state:", {
        theme,
        isDark:
          theme === "dark" ||
          (theme === "system" &&
            window.matchMedia("(prefers-color-scheme: dark)").matches),
      });
    };

    updateTheme();
    localStorage.setItem("theme", theme);

    // Listen for system theme changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      if (theme === "system") {
        updateTheme();
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme]);

  const changeTheme = (newTheme) => {
    console.log("ThemeContext: Setting theme to:", newTheme);
    setTheme(newTheme);
  };

  const value = {
    theme,
    isDark,
    changeTheme,
    themes: [
      { value: "light", label: "Light" },
      { value: "dark", label: "Dark" },
      { value: "system", label: "System" },
    ],
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};
