import * as React from 'react';
import { PlotComponent, Canvas, Any, Coord } from './common';

const d3 = require('d3');

export interface PolygonProps extends PlotComponent {
    canvas?: Canvas;
    xAxis?: (value: Any) => Any;
    yAxis?: (value: Any) => Any;
    size?: number;
    addLabel?: (lbl: string, color: string) => void;
}

function combineCoords(upperCoords: Coord[], lowerCoords: Coord[]) {
    let polygonCoords = new Array();
    for (let i = 0; i < upperCoords.length; i++) {
        polygonCoords.push(upperCoords[i]);
    }
    for (let j = lowerCoords.length - 1; j >= 0; j--) {
        polygonCoords.push(lowerCoords[j]);
    }
    return polygonCoords;
}

export class Polygon extends React.Component<PolygonProps> {
    
    render() {
        var { xAxis, yAxis, canvas, upperCoords, lowerCoords, color, size } = this.props;    
        // const coords = combineCoords(data[upperCoords].map(it => ({ x: Number(new Date(it[0])), y: Number(it[1])})), data[lowerCoords].map(it => ({ x: Number(new Date(it[0])), y: Number(it[1])})));
        const coords = combineCoords(upperCoords.map(it => ({ x: Number(new Date(it[0])), y: Number(it[1])})), lowerCoords.map(it => ({ x: Number(new Date(it[0])), y: Number(it[1])})));
        setTimeout(() => {
            if (coords.length > 0) {
                canvas.svg.append('polygon')
                    .attr('stroke', color || 'black')
                    .attr('stroke-width', `${size || 1}px`)
                    .attr('fill', color || 'black')
                    .attr('points', coords.map(p => `${xAxis(p.x)}, ${yAxis(p.y)} `).join(''));
            }
        }, 5);
        return <span />;
    }
}
