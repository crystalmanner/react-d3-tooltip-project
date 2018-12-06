import * as React from 'react';
import { PlotComponent, Canvas, Any, Coord } from './common';

const d3 = require('d3');

export interface LineProps extends PlotComponent {
    canvas?: Canvas;
    xAxis?: (value: Any) => Any;
    yAxis?: (value: Any) => Any;
    size?: number;
    addLabel?: (lbl: string, color: string) => void;
    dashed?: boolean;
}

export class Line extends React.Component<LineProps> {
    render() {
        var { xAxis, yAxis, canvas, coords, color, size, dashed } = this.props;
        const lineCoords = coords.map(it => ({ x: Number(new Date(it[0])), y: Number(it[1])}));
        setTimeout(() => {
            if (coords.length > 0) {
                const valueline = d3.line()
                    .x(function (d: Any) { return xAxis(d.x); })
                    .y(function (d: Any) { return yAxis(d.y); });

                let line = canvas.svg.append('path')
                    .data([lineCoords])
                    .attr('stroke', color || 'black')
                    .attr('stroke-width', `${size || 1}px`)
                    .attr('fill', `none`)
                    .attr('d', valueline);

                if (dashed) {
                    line.attr('stroke-dasharray', 5);
                }
            }
        }, 5);
        return <span />;
    }
}
