import { BarChart } from '@/bar-chart'
import { cn } from '@/shared'

const sampleData = [
  { label: 'Mon', value: 18 },
  { label: 'Tue', value: 22 },
  { label: 'Wed', value: 16 },
  { label: 'Thu', value: 28 },
  { label: 'Fri', value: 24 },
]

export default function App() {
  return (
    <main className="app-shell">
      <header className="app-shell__hero">
        <p className="app-shell__eyebrow">Pristine Charts</p>
        <h1 className="app-shell__title">A tree-shakeable React chart library</h1>
        <p className="app-shell__lead">
          This setup uses D3 for scale calculation, Ramda for composable data transforms, Sass for styling,
          and direct aliases from the source tree to keep the package easy to consume.
        </p>
      </header>

      <section className="app-shell__grid">
        <article className={cn('app-shell__panel', 'panel-card')}>
          <h2>Deep imports</h2>
          <p>The public entry points are small and focused, which makes each import predictable for bundlers.</p>
        </article>

        <article className="app-shell__panel">
          <h2>SVG rendering</h2>
          <p>Every visual element is rendered with React, while D3 handles the numeric scaling logic.</p>
        </article>
      </section>

      <section className="app-shell__panel">
        <h2>Sample chart</h2>
        <BarChart data={sampleData} ariaLabel="Weekly activity chart" />
      </section>
    </main>
  )
}
