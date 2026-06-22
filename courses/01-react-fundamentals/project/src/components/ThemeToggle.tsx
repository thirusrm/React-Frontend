import Button from './Button'
import { useTheme } from '../contexts/ThemeContext'

export default function ThemeToggle() {
  const { theme, toggleTheme } =
    useTheme()

  return (
    <Button
      id="theme-toggle"
      onClick={toggleTheme}
    >
      {theme === 'light'
        ? 'Dark Mode'
        : 'Light Mode'}
    </Button>
  )
}