import { matchOption } from '@/shared'

import type { SparklineProps } from '../Sparkline.types'

export function SparklineCaption({ caption }: Pick<SparklineProps, 'caption'>) {
  return matchOption(caption, {
    none: () => null,
    some: (text) => <figcaption className="pristine-sparkline__caption">{text}</figcaption>,
  })
}
