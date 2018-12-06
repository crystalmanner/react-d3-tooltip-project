import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { CartesianPlane } from '../../src/charts/baseChart';
import { Line } from '../../src/charts/line';
import { Polygon } from '../../src/charts/polygon';
import { Box } from '../../src/box';
import { Axis } from '../../src/charts/common';

const d3 = require('d3');

// ***** Helper functions to format the numbers ***********

function numberPrettify(n: number, min: number, max: number, ticks: number) {
    var interval = (max - min) / ticks;
    var e = Math.floor(Math.log10(interval)) - 1;

    if (max < 1000) {
        return n.toFixed(2);
    } else if (max < 1000000) {
        return (n / 1000).toFixed(3 - e) + 'k';
    } else if (max < 1000000000) {
        return (n / 1000000).toFixed(6 - e) + 'M';
    } else if (max < 1000000000000) {
        return (n / 1000000000).toFixed(9 - e) + 'B';
    }
}

function dateFormat(d: number) {
    return d3.timeFormat('%m/%d')(d);
}

// ***** FAKE data ********

const data = {
    'P97.5': [['2018-03-01', 145.0], ['2018-05-01', 250.0], ['2018-07-01', 260.0], ['2018-09-01', 262.0], ['2018-10-01', 262.0]],
    'P95': [['2018-03-01', 145.0], ['2018-05-01', 235.0], ['2018-07-01', 245.0], ['2018-09-01', 250.0], ['2018-10-01', 255.0]],
    'P90': [['2018-03-01', 145.0], ['2018-05-01', 215.0], ['2018-07-01', 220.0], ['2018-09-01', 232.0], ['2018-10-01', 240.0]],
    'P87.5': [['2018-03-01', 145.0], ['2018-05-01', 200.0], ['2018-07-01', 210.0], ['2018-09-01', 222.0], ['2018-10-01', 230.0]],
    'P12.5': [['2018-03-01', 145.0], ['2018-05-01', 160.0], ['2018-07-01', 170.0], ['2018-09-01', 185.0], ['2018-10-01', 182.0]],
    'P10': [['2018-03-01', 145.0], ['2018-05-01', 150.0], ['2018-07-01', 155.0], ['2018-09-01', 165.0], ['2018-10-01', 172.0]],
    'P5': [['2018-03-01', 145.0], ['2018-05-01', 140.0], ['2018-07-01', 146.0], ['2018-09-01', 140.0], ['2018-10-01', 140.0]],
    'P2.5': [['2018-03-01', 145.0], ['2018-05-01', 130.0], ['2018-07-01', 140.0], ['2018-09-01', 132.0], ['2018-10-01', 122.0]],
    'history': [['2018-01-01', 0.0], ['2018-02-01', 80.0], ['2018-03-01', 145.0], ['2018-05-01', 175.0], ['2018-07-01', 190.0], ['2018-09-01', 200.0], ['2018-10-01', 212.0]],
    'forecast': [['2018-01-01', 0.0], ['2018-02-01', 80.0], ['2018-03-01', 145.0], ['2018-05-01', 175.0], ['2018-07-01', 190.0], ['2018-09-01', 200.0], ['2018-10-01', 212.0]],
    'target': [['2018-03-01', 125.0], ['2018-05-01', 165.0], ['2018-07-01', 185.0], ['2018-09-01', 220.0], ['2018-10-01', 225.0]],
    'verticalLine' : [['2018-03-01', 0], ['2018-03-01', 280.0]],
    
 };

// *******************

storiesOf('Components/Charts', module)
    .add(
        'FanChart',
        () => {
            const xAxis: Axis = {
                label: 'Date',
                formatter: (value) => dateFormat(value),
            };
            const yAxis: Axis = {
                label: 'USD',
                formatter: (value, ticks, min, max) => numberPrettify(value, min, max, ticks),
            };
            return(
                <div>
                    <Box height={450} updateOnPageResize={true}>
                        <CartesianPlane
                            id={`plot`}
                            hideXGrid={true}
                            axisx={xAxis}
                            axisy={yAxis}
                        >
                            <Line label={'History'} size={4} color={`black`} dashed={false} coords={data.history}/>
                            <Polygon label={'95%'} size={1} color={`#b4d8ff`} upperCoords={data['P97.5']} lowerCoords={data['P2.5']} firstLabel={'PS97.5'} lastLabel={'PS2.5'} isPolygon={true}/>
                            <Polygon label={'90%'} size={1} color={`#96baff`} upperCoords={data.P95} lowerCoords={data.P5} firstLabel={'PS95'} lastLabel={'PS5'} isPolygon={true}/>
                            <Polygon label={'75%'} size={1} color={`#779cff`} upperCoords={data['P87.5']} lowerCoords={data['P12.5']} firstLabel={'PS87.5'} lastLabel={'PS12.5'} isPolygon={true}/>
                            <Line label={'Forecast'} size={2} color={`black`} dashed={true} coords={data.forecast}/>
                            <Line label={'Target'} size={2} color={`red`} dashed={false} coords={data.target}/>
                            <Line size={1} color={`gray`} dashed={true} coords={data.verticalLine} noRange={true}/>
                        </CartesianPlane>
                    </Box>
                </div >
            );
        }
    );
