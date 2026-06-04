import { matchOption } from '@/shared'

import type { ProgressBarProps } from '../ProgressBar.types'

type ProgressBarCaptionProps = Pick<ProgressBarProps, 'caption'>

export function ProgressBarCaption({ caption }: ProgressBarCaptionProps) {
  return matchOption(caption, {
    none: () => null,
    some: (content) => (
      <figcaption className="pristine-progress-bar__caption">{content}</figcaption>
    ),
  })
}
