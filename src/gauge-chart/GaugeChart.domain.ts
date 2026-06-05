import { err, mapResult, none, ok, some } from '../shared'
import type { Result } from '../shared'
import {
  all,
  allPass,
  always,
  anyPass,
  complement,
  cond,
  defaultTo,
  findIndex,
} from '../shared/fp'

import type {
  GaugeChartError,
  GaugeChartInput,
  GaugeChartResult,
  GaugeChartSummary,
  PerformanceZone,
  ScaleRange,
  ValidatedGaugeChartInput,
  ValidatedPerformanceZone,
} from './GaugeChart.types'

type GaugeChartInputResult = Result<ValidatedGaugeChartInput, GaugeChartError>
type GaugeChartInputValidator = [
  (input: GaugeChartInput) => boolean,
  (input: GaugeChartInput) => GaugeChartInputResult,
]
type ZonePair = readonly [PerformanceZone, PerformanceZone]

const gaugeChartRules = {
  invalidScaleMinimum: (minimum: unknown): GaugeChartError => ({
    type: 'InvalidScaleMinimum',
    message: 'Gauge chart minimum must be a finite number.',
    details: some(`Invalid minimum: ${String(minimum)}.`),
  }),
  invalidScaleMaximum: (maximum: unknown, minimum: unknown): GaugeChartError => ({
    type: 'InvalidScaleMaximum',
    message: 'Gauge chart maximum must be a finite number greater than the minimum.',
    details: some(`Invalid maximum: ${String(maximum)} for minimum ${String(minimum)}.`),
  }),
  currentValueOutOfRange: (value: unknown, scaleRange: ScaleRange): GaugeChartError => ({
    type: 'CurrentValueOutOfRange',
    message: 'Gauge chart current value must be a finite number within the scale range.',
    details: some(
      `Current value ${String(value)} is outside ${String(scaleRange.minimum)} to ${String(
        scaleRange.maximum,
      )}.`,
    ),
  }),
  noZonesProvided: (): GaugeChartError => ({
    type: 'NoZonesProvided',
    message: 'A gauge chart needs at least one performance zone.',
    details: none,
  }),
  emptyZoneLabel: (index: number): GaugeChartError => ({
    type: 'EmptyZoneLabel',
    message: 'Every gauge chart performance zone needs a non-empty label.',
    details: some(`Empty zone label at index ${String(index)}.`),
  }),
  invalidZoneBounds: (index: number): GaugeChartError => ({
    type: 'InvalidZoneBounds',
    message: 'Every gauge chart zone lower bound must be less than its upper bound.',
    details: some(`Invalid zone bounds at index ${String(index)}.`),
  }),
  zonesDoNotCoverScale: (scaleRange: ScaleRange): GaugeChartError => ({
    type: 'ZonesDoNotCoverScale',
    message: 'Gauge chart zones must exactly cover the scale with no gaps or overlaps.',
    details: some(
      `Expected zones to cover ${String(scaleRange.minimum)} to ${String(
        scaleRange.maximum,
      )}.`,
    ),
  }),
}

const isFiniteNumber = (value: unknown) =>
  allPass([
    (candidate: unknown) => typeof candidate === 'number',
    (candidate: unknown) => Number.isFinite(candidate),
  ])(value)

const hasValidScaleMinimum = (input: GaugeChartInput) => isFiniteNumber(input.minimum)

const hasValidScaleMaximum = (input: GaugeChartInput) =>
  allPass([
    (candidate: GaugeChartInput) => isFiniteNumber(candidate.maximum),
    (candidate: GaugeChartInput) => Number(candidate.maximum) > Number(candidate.minimum),
  ])(input)

const toScaleRange = (input: GaugeChartInput): ScaleRange => ({
  minimum: Number(input.minimum),
  maximum: Number(input.maximum),
})

const isWithinScaleRange = (scaleRange: ScaleRange) =>
  allPass([
    (value: number) => value >= scaleRange.minimum,
    (value: number) => value <= scaleRange.maximum,
  ])

const currentValueIsWithinScale = (input: GaugeChartInput) =>
  allPass([
    (candidate: GaugeChartInput) => isFiniteNumber(candidate.currentValue),
    (candidate: GaugeChartInput) =>
      isWithinScaleRange(toScaleRange(candidate))(Number(candidate.currentValue)),
  ])(input)

const hasZones = (input: GaugeChartInput) => input.zones.length > 0

const hasNonEmptyLabel = (zone: PerformanceZone) => zone.label.trim().length > 0

const hasOnlyNonEmptyLabels = (input: GaugeChartInput) =>
  all(hasNonEmptyLabel, [...input.zones])

const findEmptyZoneLabelIndex = (zones: readonly PerformanceZone[]) =>
  findIndex(complement(hasNonEmptyLabel), [...zones])

const hasValidZoneBounds = (zone: PerformanceZone) =>
  allPass([
    (candidate: PerformanceZone) => isFiniteNumber(candidate.lowerBound),
    (candidate: PerformanceZone) => isFiniteNumber(candidate.upperBound),
    (candidate: PerformanceZone) => candidate.lowerBound < candidate.upperBound,
  ])(zone)

const hasOnlyValidZoneBounds = (input: GaugeChartInput) =>
  all(hasValidZoneBounds, [...input.zones])

const findInvalidZoneBoundsIndex = (zones: readonly PerformanceZone[]) =>
  findIndex(complement(hasValidZoneBounds), [...zones])

const toZonePair = (zones: readonly PerformanceZone[]) =>
  (rightZone: PerformanceZone, index: number): ZonePair => [zones[index], rightZone]

const getZonePairs = (zones: readonly PerformanceZone[]): readonly ZonePair[] =>
  zones.slice(1).map(toZonePair(zones))

const zonesAreContiguous = ([left, right]: ZonePair) =>
  left.upperBound === right.lowerBound

const hasContiguousZones = (zones: readonly PerformanceZone[]) =>
  all(zonesAreContiguous, getZonePairs(zones))

const zonesCoverScale = (input: GaugeChartInput) =>
  allPass([
    (candidate: GaugeChartInput) => candidate.zones[0].lowerBound === Number(candidate.minimum),
    (candidate: GaugeChartInput) =>
      candidate.zones[candidate.zones.length - 1].upperBound === Number(candidate.maximum),
    (candidate: GaugeChartInput) => hasContiguousZones(candidate.zones),
  ])(input)

const toValidatedInput = (input: GaugeChartInput): ValidatedGaugeChartInput => ({
  currentValue: Number(input.currentValue),
  minimum: Number(input.minimum),
  maximum: Number(input.maximum),
  zones: input.zones,
})

const inputValidators: GaugeChartInputValidator[] = [
  [
    complement(hasValidScaleMinimum),
    (input: GaugeChartInput) => err(gaugeChartRules.invalidScaleMinimum(input.minimum)),
  ],
  [
    complement(hasValidScaleMaximum),
    (input: GaugeChartInput) =>
      err(gaugeChartRules.invalidScaleMaximum(input.maximum, input.minimum)),
  ],
  [
    complement(currentValueIsWithinScale),
    (input: GaugeChartInput) =>
      err(gaugeChartRules.currentValueOutOfRange(input.currentValue, toScaleRange(input))),
  ],
  [complement(hasZones), () => err(gaugeChartRules.noZonesProvided())],
  [
    complement(hasOnlyNonEmptyLabels),
    (input: GaugeChartInput) =>
      err(gaugeChartRules.emptyZoneLabel(findEmptyZoneLabelIndex(input.zones))),
  ],
  [
    complement(hasOnlyValidZoneBounds),
    (input: GaugeChartInput) =>
      err(gaugeChartRules.invalidZoneBounds(findInvalidZoneBoundsIndex(input.zones))),
  ],
  [
    complement(zonesCoverScale),
    (input: GaugeChartInput) => err(gaugeChartRules.zonesDoNotCoverScale(toScaleRange(input))),
  ],
  [always(true), (input: GaugeChartInput) => ok(toValidatedInput(input))],
]

export const validateGaugeChartInput: (
  input: GaugeChartInput
) => GaugeChartInputResult = cond(inputValidators)

const toNeedlePosition = (currentValue: number, scaleRange: ScaleRange) =>
  (currentValue - scaleRange.minimum) / (scaleRange.maximum - scaleRange.minimum)

const containsCurrentValue =
  (currentValue: number, scaleRange: ScaleRange) => (zone: ValidatedPerformanceZone) =>
    allPass([
      (candidate: ValidatedPerformanceZone) => currentValue >= candidate.lowerBound,
      anyPass([
        (candidate: ValidatedPerformanceZone) => currentValue < candidate.upperBound,
        (candidate: ValidatedPerformanceZone) => candidate.upperBound === scaleRange.maximum,
      ]),
    ])(zone)

const getActiveZone = (
  currentValue: number,
  zones: readonly ValidatedPerformanceZone[],
  scaleRange: ScaleRange,
) =>
  defaultTo(
    zones[zones.length - 1],
    zones.find(containsCurrentValue(currentValue, scaleRange)),
  )

const summarizeGaugeChart = (input: ValidatedGaugeChartInput): GaugeChartSummary => {
  const scaleRange = {
    minimum: input.minimum,
    maximum: input.maximum,
  }

  return {
    ...input,
    scaleRange,
    activeZone: getActiveZone(input.currentValue, input.zones, scaleRange),
    needlePosition: toNeedlePosition(input.currentValue, scaleRange),
  }
}

export function computeGaugeChart(input: GaugeChartInput): GaugeChartResult {
  return mapResult<ValidatedGaugeChartInput, GaugeChartSummary, GaugeChartError>(
    summarizeGaugeChart,
  )(validateGaugeChartInput(input))
}
