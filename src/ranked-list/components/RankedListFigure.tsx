import type { CSSProperties } from 'react'

import { classNames } from '@/shared'

import type { RankedListModel } from '../RankedList.model'
import type { RankedListProps } from '../RankedList.types'

import { RankedListCaption } from './RankedListCaption'
import { RankedListEntry } from './RankedListEntry'

type RankedListStyle = CSSProperties & {
  readonly '--pristine-ranked-list-width': string
  readonly '--pristine-ranked-list-min-height': string
}

type RankedListFigureProps = Pick<
  RankedListProps,
  'ariaLabel' | 'caption' | 'className' | 'height' | 'showRankChanges' | 'width'
> & {
  readonly rankedList: RankedListModel
}

const toFigureStyle = (width: number, height: number): RankedListStyle => ({
  '--pristine-ranked-list-width': `${String(width)}px`,
  '--pristine-ranked-list-min-height': `${String(height)}px`,
})

export function RankedListFigure({
  ariaLabel,
  caption,
  className,
  height,
  rankedList,
  showRankChanges,
  width,
}: RankedListFigureProps) {
  return (
    <figure
      className={classNames(['pristine-ranked-list', className])}
      aria-label={ariaLabel}
      style={toFigureStyle(width, height)}
    >
      <ol className="pristine-ranked-list__entries">
        {rankedList.entries.map((entry) => (
          <RankedListEntry
            key={entry.label}
            entry={entry}
            showRankChanges={showRankChanges}
          />
        ))}
      </ol>
      <RankedListCaption caption={caption} />
    </figure>
  )
}
