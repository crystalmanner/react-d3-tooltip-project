// import { StringifyOptions } from 'querystring';
import { ReactText } from 'react';

// tslint:disable-next-line:no-any
export type Any = any;

export interface Canvas {
  svg: Any;
}

export interface Margin {
  top?: number;
  right?: number;
  bottom?: number;
  left?: number;
}

export interface Range {
  xAxis: { min: number; max: number; };
  yAxis: { min: number; max: number; };
}

export interface Coord {
  x: number;
  y: number;
}

export interface PlotComponent {
  coords?: ReactText[][];
  upperCoords?: ReactText[][];
  lowerCoords?: ReactText[][];
  color?: string;
  label?: string;
  isPolygon?: boolean;
  noRange?: boolean;
  firstLabel?: string;
  lastLabel?: string;
}

export interface Axis {
  label?: string;
  formatter?: (value: Any, ticks: number, min: number, max: number) => Any;
}

export interface TooltipContent {
  isPolygon?: boolean; // true=polygon, false=line
  label?: string;
  firstLabel?: string;  // PS95, target, ..
  lastLabel?: string;   // PS5
  color?: string;
  upperCoords?: Coord[];
  lowerCoords?: Coord[]; // when the type is polygon, only use.
}