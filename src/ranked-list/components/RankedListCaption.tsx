import { matchOption } from '@/shared'

import type { RankedListProps } from '../RankedList.types'

export function RankedListCaption({ caption }: Pick<RankedListProps, 'caption'>) {
  return matchOption(caption, {
    none: () => null,
    some: (value) => (
      <figcaption className="pristine-ranked-list__caption">{value}</figcaption>
    ),
  })
}
