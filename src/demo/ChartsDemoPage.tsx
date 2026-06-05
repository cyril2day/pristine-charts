import { useEffect, useState } from 'react'

import {
  GitHubIcon,
  MoonIcon,
  SunIcon,
} from '@/icons'
import {
  matchOption,
  none,
  some,
} from '@/shared'
import type { Option } from '@/shared'
import {
  always,
  ifElse,
} from '@/shared/fp'

import type { ChartDemo } from './ChartDemo.types'
import { ChartDemoModal } from './ChartDemoModal'
import {
  chartDemos,
  createInitialDemoState,
} from './ChartDemoRegistry'

type Theme = 'light' | 'dark'

const GITHUB_REPOSITORY_URL = 'https://github.com/cyril2day/pristine-charts'
const SWITCH_TO_LIGHT_THEME_LABEL = 'Switch to light theme'
const SWITCH_TO_DARK_THEME_LABEL = 'Switch to dark theme'

const isLightTheme = (theme: Theme) => theme === 'light'
const isTrue = (value: boolean) => value

const getNextTheme: (currentTheme: Theme) => Theme = ifElse(
  isLightTheme,
  always('dark'),
  always('light'),
)

const getThemeToggleLabel: (isDarkTheme: boolean) => string = ifElse(
  isTrue,
  always(SWITCH_TO_LIGHT_THEME_LABEL),
  always(SWITCH_TO_DARK_THEME_LABEL),
)

const renderThemeIcon = ifElse(
  isTrue,
  () => <SunIcon />,
  () => <MoonIcon />,
)

export function ChartsDemoPage() {
  const [theme, setTheme] = useState<Theme>('light')
  const [activeDemo, setActiveDemo] = useState<Option<ChartDemo>>(none)
  const [demoState, setDemoState] = useState(createInitialDemoState)
  const isDarkTheme = theme === 'dark'

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  const toggleTheme = () => {
    setTheme(getNextTheme)
  }

  return (
    <main className="app-shell">
      <header className="app-shell__header">
        <div className="app-shell__intro">
          <p className="app-shell__eyebrow">Pristine Charts</p>
          <h1 className="app-shell__title">Current Charts</h1>
          <p className="app-shell__lead">
            Chart components currently exposed by the library.
          </p>
        </div>
        <div className="app-shell__actions" aria-label="Demo actions">
          <button
            aria-label={getThemeToggleLabel(isDarkTheme)}
            aria-pressed={isDarkTheme}
            className="app-shell__icon-button"
            onClick={toggleTheme}
            type="button"
          >
            {renderThemeIcon(isDarkTheme)}
          </button>
          <a
            aria-label="Open GitHub repository"
            className="app-shell__icon-button"
            href={GITHUB_REPOSITORY_URL}
            rel="noreferrer"
            target="_blank"
          >
            <GitHubIcon />
          </a>
        </div>
      </header>

      <section className="app-shell__grid">
        {chartDemos.map((demo) => (
          <section className="app-shell__panel" key={demo.key}>
            <header className="app-shell__panel-header">
              <h2>{demo.title}</h2>
              <button
                className="app-shell__demo-button"
                onClick={() => setActiveDemo(some(demo))}
                type="button"
              >
                demo
              </button>
            </header>
            {demo.renderCard()}
          </section>
        ))}
      </section>

      {matchOption(activeDemo, {
        some: (demo) => (
          <ChartDemoModal
            demo={demo}
            onChange={setDemoState}
            onClose={() => setActiveDemo(none)}
            state={demoState}
          />
        ),
        none: () => null,
      })}
    </main>
  )
}
