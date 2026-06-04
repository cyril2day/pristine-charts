import { classNames, matchOption } from '../shared'
import type { ChartErrorInputProps } from './ChartError.types'

const renderDetails = (details: ChartErrorInputProps['details']) =>
  matchOption(details, {
    none: () => null,
    some: (value) => <p className="pristine-chart-error__details">{value}</p>,
  })

export function ChartError({
  title,
  message,
  details,
  className,
  role,
}: ChartErrorInputProps) {
  return (
    <div className={classNames(['pristine-chart-error', className])} role={role}>
      <p className="pristine-chart-error__title">{title}</p>
      <p className="pristine-chart-error__message">{message}</p>
      {renderDetails(details)}
    </div>
  )
}
