import type { SparklineModel } from '../Sparkline.model'

type SparklinePathProps = {
  readonly sparkline: SparklineModel
}

export function SparklinePath({ sparkline }: SparklinePathProps) {
  return <path className="pristine-sparkline__path" d={sparkline.path} aria-hidden="true" />
}
