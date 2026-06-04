import { matchOption } from '@/shared'

import type { KPICardProps } from '../KPICard.types'

type KPICardCaptionProps = Pick<KPICardProps, 'caption'>

export function KPICardCaption({ caption }: KPICardCaptionProps) {
  return matchOption(caption, {
    none: () => null,
    some: (content) => (
      <figcaption className="pristine-kpi-card__caption">{content}</figcaption>
    ),
  })
}
