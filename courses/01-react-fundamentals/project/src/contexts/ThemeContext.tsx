import {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react'

type Theme = 'light' | 'dark'

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
}

export const ThemeContext =
  createContext<ThemeContextType | null>(
    null,
  )

export function ThemeProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [theme, setTheme] =
    useState<Theme>('light')

  useEffect(() => {
    const savedTheme =
      localStorage.getItem(
        'task-app-theme',
      ) as Theme | null

    if (savedTheme) {
      setTheme(savedTheme)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(
      'task-app-theme',
      theme,
    )
  }, [theme])

  const toggleTheme = () => {
    setTheme((prev) =>
      prev === 'light'
        ? 'dark'
        : 'light',
    )
  }

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context =
    useContext(ThemeContext)

  if (!context) {
    throw new Error(
      'useTheme must be used within ThemeProvider',
    )
  }

  return context
}