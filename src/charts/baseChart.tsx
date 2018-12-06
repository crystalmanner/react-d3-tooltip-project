import * as React from 'react';
import { Coord, Any, Canvas, Margin, PlotComponent, Axis, TooltipContent } from './common';

const d3 = require('d3');

export interface CartesianPlaneProps {
    id: string;
    hideXGrid?: boolean;
    hideYGrid?: boolean;
    width?: number;
    height?: number;
    axisx?: Axis;
    axisy?: Axis;
    data?: Any;
}

interface CartesianPlaneState { 
    hiddenIndex: number[]; 
    resize: boolean;
}

interface D3Param {
    gridCanvas: Canvas;
    rootCanvas: Canvas;
    gridWidth: number;
    margin: Margin;
    gridHeight: number;
    yAxis: Any;
    xAxis: Any;
    range: Coord[];
    childrenInfo: TooltipContent[]; 
}

export class CartesianPlane extends React.Component<CartesianPlaneProps, CartesianPlaneState> {
    constructor(props: CartesianPlaneProps) {
        super(props);
        this.state = { 
            hiddenIndex: [], 
            resize: false, 
        };
    }
      
    createChild(child: Any, xAxis: (value: Any) => Any, yAxis: (value: Any) => Any, canvas: Any) {
        return React.cloneElement(child as Any, { ...{ xAxis, yAxis, canvas } });
    }

    createChildren(children: PlotComponent[], xAxis: (value: Any) => Any, yAxis: (value: Any) => Any, canvas: Any) {
        return children.map(child => this.createChild(child, xAxis, yAxis, canvas));
    }

    d3render(param: D3Param) { 
        d3.select(`.plot-${this.props.id}`).select('svg').remove();

        const xAxisFormat = (d: Any) => this.props.axisx.formatter ? this.props.axisx.formatter(d, xticks, param.range[0].x, param.range[1].x) : d;
        const yAxisFormat = (d: Any) => this.props.axisy.formatter ? this.props.axisy.formatter(d, yticks, param.range[0].y, param.range[1].y) : d;
        const labelxAxis = (d: Any) => this.props.axisx.label ? this.props.axisx.label : d;
        const labelyAxis = (d: Any) => this.props.axisy.label ? this.props.axisy.label : d;
        const svg = param.rootCanvas.svg = d3.select(`.plot-${this.props.id}`)
            .append('svg')
            .attr('width', this.props.width)
            .attr('height', this.props.height);

        const grid = svg.append('g')
            .attr('transform', `translate(${param.margin.left}, ${param.margin.top})`);

        const xticks = param.gridHeight / 80;
        const yticks = param.gridWidth / 80;

        grid.append('g')
            .attr('class', 'grid')
            .attr('transform', `translate(0, ${param.gridHeight})`)
            .call(d3
                .axisBottom(param.xAxis)
                .ticks(Math.floor(param.gridWidth / 80))
                .tickFormat(xAxisFormat)
                .tickSize(this.props.hideXGrid ? 0 : -param.gridHeight));

        grid.append('g')
            .attr('class', 'grid')
            .call(d3
                .axisLeft(param.yAxis)
                .ticks(Math.floor(param.gridHeight / 80))
                .tickFormat(yAxisFormat)
                .tickSize(this.props.hideYGrid ? 0 : -param.gridWidth));

        param.gridCanvas.svg = grid.append('svg')
            .attr('width', param.gridWidth + param.margin.left + param.margin.right)
            .attr('height', param.gridHeight + param.margin.top + param.margin.bottom);

        // ********************************************************
        // this part of the code is used to generate the dot in the plot that appear when 
        // we move the mouse over the lines

        const hifofocus = grid.append('g').style('display', 'none');

        hifofocus.append('circle')
            .attr('class', 'hifo')
            .attr('stroke-width', `${2}px`)
            .style('fill', 'black')
            .style('stroke', 'white')
            .attr('r', 6)
            .attr('transform', 'translate(' + param.xAxis(-1) + ',' + param.yAxis(-1) + ')');

        const focus = grid.append('g').style('display', 'none');

        focus.append('circle')
            .attr('class', 'target')
            .attr('stroke-width', `${2}px`)
            .style('fill', 'red')
            .style('stroke', 'white')
            .attr('r', 6)
            .attr('transform', 'translate(' + param.xAxis(-1) + ',' + param.yAxis(-1) + ')');
        // Display X-Axis, Y-Axis labels
        const xAxisLabel = grid.append('g').append('text')
            .attr('class', 'xAxisLabel')
            .attr('fill', 'black')
            .style('font-size', '12px');
        xAxisLabel.attr('transform', 'translate(' + (param.gridWidth - 20) + ',' + (param.gridHeight + 10) + ')')
            .text(labelxAxis);
            
        const yAxisLabel = grid.append('g').append('text')
            .attr('class', 'xAxisLabel')
            .attr('fill', 'black')
            .style('font-size', '12px');
        yAxisLabel.attr('transform', 'translate(' + '-25' + ',' + 0 + ')')
            .text(labelyAxis);
        // Tooltip content
        const tooltip = grid.append('g').style('display', 'none');
        tooltip.append('rect')
            .attr('class', 'tooltip')
            .attr('stroke-width', `${1}px`)
            .attr('opacity', '0.7')
            .style('fill', 'white')
            .style('stroke', 'black')
            .attr('r', 6);

        const tooltipDate = tooltip.append('g');
        tooltipDate.append('text')
            .attr('class', 'tooltipDate')
            .attr('fill', 'black')
            .style('font-size', '12px');

        for (let i = 0; i < param.childrenInfo.length; i++) {
            tooltipDate.append('text')
                .attr('class', 'id' + i)
                .attr('fill', 'black')
                .style('font-size', '12px');
            tooltipDate.append('circle')
                .attr('class', 'dotid' + i)
                .style('fill', param.childrenInfo[i].color)
                .attr('r', 4);
        }

        function getPosYbyPosX(resdata: Coord[], CurPosX: number) {
            let posLeft = null;     // left side history and forecast value around mouse position
            let posRight = null;    // right side history and forecast value around mouse position
            
            for (let i = 0; i < resdata.length; i++) {
                if ( CurPosX - resdata[i].x >= 0) {
                    if (!posLeft) {
                        posLeft = resdata[i];
                    } else if (resdata[i].x > posLeft.x) {
                        posLeft = resdata[i];
                    }
                } else {
                    if (!posRight) {
                        posRight = resdata[i];
                    } else if (resdata[i].x < posRight.x) {
                        posRight = resdata[i];
                    }
                } 
            }
            return ((CurPosX - posLeft.x) * posRight.y + posLeft.y * (posRight.x - CurPosX)) / (posRight.x - posLeft.x);
        }

        function mousemove() {
            const m = d3.mouse(this);
            const mCoord = {
                x: param.xAxis.invert(m[0]),
                y: param.yAxis.invert(m[1]),
            };
            
            // displaying history and forecast focus
            let hifoLeft =  {x: 0, y: 0 };      // left side target value around mouse position
            let hifoRight = null;               // right side target value around mouse position
            const hifodata: Coord[] = [].concat(...param.childrenInfo.filter(ic => ic.label === 'History').map(ic => ic.upperCoords));
            
            for (let i = 0; i < hifodata.length; i++) {
                if (mCoord.x - hifodata[i].x >= 0) {
                    if (!hifoLeft) {
                        hifoLeft = hifodata[i];
                    } else if (hifodata[i].x > hifoLeft.x) {
                        hifoLeft = hifodata[i];
                    }
                } else {
                    if (!hifoRight) {
                        hifoRight = hifodata[i];
                    } else if (hifodata[i].x < hifoRight.x) {
                        hifoRight = hifodata[i];
                    }
                } 
            }

            let hifoPosY = ((mCoord.x - hifoLeft.x) * hifoRight.y + hifoLeft.y * (hifoRight.x - mCoord.x)) / (hifoRight.x - hifoLeft.x);
            hifofocus.select('circle.hifo').attr('transform', 'translate(' + param.xAxis(mCoord.x) + ',' + param.yAxis(hifoPosY) + ')');

            // displaying target focus
            const targetdata: Coord[] = [].concat(...param.childrenInfo.filter(ic => ic.label === 'Target').map(ic => ic.upperCoords));
            let targetLeft =  {x: 0, y: 0 };    // left side target value around mouse position
            let targetRight = null;             // right side target value around mouse position
            for (let i = 0; i < targetdata.length; i++) {
                if (mCoord.x - targetdata[i].x >= 0) {
                    if (!targetLeft) {
                        targetLeft = targetdata[i];
                    } else if (targetdata[i].x > targetLeft.x) {
                        targetLeft = targetdata[i];
                    }
                } else {
                    if (!targetRight) {
                        targetRight = targetdata[i];
                    } else if (targetdata[i].x < targetRight.x) {
                        targetRight = targetdata[i];
                    }
                } 
            }

            let targetPosX = mCoord.x;
            let targetPosY = null;
            if (targetLeft.x === 0) {       // if mouse is on history graph
                targetPosX = -1;
            }
            targetPosY = ((mCoord.x - targetLeft.x) * targetRight.y + targetLeft.y * (targetRight.x - mCoord.x)) / (targetRight.x - targetLeft.x);
            focus.select('circle.target').attr('transform', 'translate(' + param.xAxis(targetPosX) + ',' + param.yAxis(targetPosY) + ')');
            // this.displayTooltip(m[0], m[1], param.gridWidth, tooltip, mCoord.x, targetLeft.x, );
            // display tooltip
            let tooltipPosX = m[0] + 10;
            let tooltipPosY = m[1] + 10;
            if (tooltipPosX >= param.gridWidth - 180) {
                tooltipPosX = param.gridWidth - 180;
            }
            // display Tooltip Date
            let tooltipDatePosX = tooltipPosX + 5;
            let tooltipDatePosY = tooltipPosY + 15;
            tooltip.select('text.tooltipDate')
                .attr('transform', 'translate(' + tooltipDatePosX + ',' + tooltipDatePosY + ')')
                .text('' + d3.timeFormat('%Y-%m-%d')(mCoord.x));

            // History and Forecast Position on tooltip
            let tooltipHiFoPosX = tooltipDatePosX + 10;
            let tooltipHiFoPosY = tooltipDatePosY + 15;

            if (targetLeft.x === 0) {      // display Tooltip when a mouse is on history graph
                tooltip.select('rect.tooltip')
                    .attr('transform', 'translate(' + tooltipPosX + ',' + tooltipPosY + ')')
                    .attr('width', `${120}px`)
                    .attr('height', `${35}px`);

                for (let i = 0; i < param.childrenInfo.length; i++ ) {
                    tooltip.select('text.id' + i).style('display', 'none');    
                    tooltip.select('circle.dotid' + i).style('display', 'none');    
                }

                tooltip.select('text.id0')
                    .attr('transform', 'translate(' + tooltipHiFoPosX + ',' + tooltipHiFoPosY + ')')
                    .style('display', null)
                    .text('History: ' + yAxisFormat(hifoPosY));
                
                tooltip.select('circle.dotid0')
                    .attr('transform', 'translate(' + (tooltipHiFoPosX - 8) + ',' + (tooltipHiFoPosY - 4) + ')')
                    .style('display', null)
                    .text('History: ' + yAxisFormat(hifoPosY));
                
            } else {                      // display Tooltip when a mouse is on forecast graph
                tooltip.select('rect.tooltip')
                    .attr('transform', 'translate(' + tooltipPosX + ',' + tooltipPosY + ')')
                    .attr('width', `${180}px`)
                    .attr('height', `${14 + param.childrenInfo.length * 11}px`);

                for (let i = 0; i < param.childrenInfo.length; i++ ) {
                    tooltip.select('text.id' + i).style('display', null);
                    tooltip.select('circle.dotid' + i).style('display', null); 
                }
                tooltip.select('text.id0').style('display', 'none');
                tooltip.select('circle.dotid0').style('display', 'none');
                for (let i = 0; i < param.childrenInfo.length; i++) {
                    if ( param.childrenInfo[i].isPolygon ) {
                        let upperPosY = getPosYbyPosX(param.childrenInfo[i].upperCoords, mCoord.x);
                        let lowerPosY = getPosYbyPosX(param.childrenInfo[i].lowerCoords, mCoord.x);
                        tooltip.select('text.id' + i)
                            .attr('transform', 'translate(' + tooltipHiFoPosX + ',' + (tooltipHiFoPosY + 11 * i - 11) + ')')
                            .text(param.childrenInfo[i].lastLabel + ' :' + yAxisFormat(lowerPosY) + '  ' + param.childrenInfo[i].firstLabel + ':' + yAxisFormat(upperPosY));
                    } else {
                        let linePosY = getPosYbyPosX(param.childrenInfo[i].upperCoords, mCoord.x);
                        tooltip.select('text.id' + i)
                            .attr('transform', 'translate(' + tooltipHiFoPosX + ',' + (tooltipHiFoPosY + 11 * i - 11) + ')')
                            .text(param.childrenInfo[i].label + ' :' + yAxisFormat(linePosY));
                    }
                    tooltip.select('circle.dotid' + i)
                        .attr('transform', 'translate(' + (tooltipHiFoPosX - 8) + ',' + (tooltipHiFoPosY + 11 * i - 15) + ')');
                }           
            }
        }

        if (param.gridWidth > 0) {
            grid.append('rect')
                .attr('width', param.gridWidth)
                .attr('height', param.gridHeight)
                .style('fill', 'none')
                .style('pointer-events', 'all')
                .on('mouseover', function () { 
                    focus.style('display', null); 
                    hifofocus.style('display', null); 
                    tooltip.style('display', null); 
                })
                .on('mouseout', function () { 
                    focus.style('display', 'none'); 
                    hifofocus.style('display', 'none'); 
                    tooltip.style('display', 'none'); 
                })
                .on('mousemove', mousemove);
        }

        svg.selectAll('g.grid:first-child g.tick text').attr('transform', 'translate(0, ' + 8 + ')');
        // ********************************************************
    }

    getChildrenAsArray(): Any[] {
        return Array.isArray(this.props.children)
            ? this.props.children
            : [this.props.children];
    }

    getInnerComponents(childArr: Any[]): PlotComponent[] {
        return childArr.map((c: Any) => c.props as PlotComponent);
    }

    removeIndex(arr: Any[], idxList: number[]) {
        let newArray = [];

        for (let i = 0; i < arr.length; i++) {
            if (idxList.indexOf(i) === -1) {
                newArray.push(arr[i]);
            }
        }
        return newArray;
    }

    addOrRemove(arr: Any[], value: Any) {
        if (arr.indexOf(value) === -1) {
            return arr.concat([value]);
        }
        return arr.filter(it => it !== value);
    }

    handleLabelClick(e: Any, idx: number) {
        this.setState({ hiddenIndex: this.addOrRemove(this.state.hiddenIndex, idx) });
    }

    getD3RenderParam() {
        // this ibject is been created to keep the svg reference 
        // that will be sent to the chield components
        const gridCanvas: Canvas = { svg: null };
        const rootCanvas: Canvas = { svg: null };

        // remove the hidden index from the original list
        // this happen when we click to the chart labels 
        // to remove some component from the grid
        const children = this.removeIndex(this.getChildrenAsArray(), this.state.hiddenIndex);

        // we are using the `innerComponents` to map and return all the coords from the chield elements.
        // The grid size will take in account the coords that needs to be in the plot, so we have this 
        // condition below to remove the hidden component coords to have the resizing effect in the plot.
        const innerComponents = this.state.resize
            ? this.getInnerComponents(children)
            : this.getInnerComponents(this.getChildrenAsArray());

        // arbitrarial margin vaLUES
        const margin = {
            top: 10,
            right: 25,
            bottom: 20,
            left: 50
        };

        // computing the size based in the arbitrarial margin values
        const gridWidth = this.props.width - margin.left - margin.right;
        const gridHeight = this.props.height - margin.top - margin.bottom;

        const xAxis = d3.scaleLinear().range([0, gridWidth]);
        const yAxis = d3.scaleLinear().range([gridHeight, 0]);
        let allcoords =  new Array();
        var childrenInfo = new Array();
        
        for (let i = 0; i < innerComponents.length; i++) {
            const child = innerComponents[i];
            let upper: Coord[];
            let lower: Coord[];
            let item = {isPolygon: false, label: '', firstLabel: '', lastLabel: '', upperCoords: upper, lowerCoords: lower, color: 'black'};
            if (child.isPolygon) {
                item.isPolygon = true;
                item.firstLabel = child.firstLabel;
                item.lastLabel = child.lastLabel;
                item.upperCoords = child.upperCoords.map(it => ({ x: Number(new Date(it[0])), y: Number(it[1])}));
                item.lowerCoords = child.lowerCoords.map(it => ({ x: Number(new Date(it[0])), y: Number(it[1])}));
                item.color = child.color;
                allcoords = allcoords.concat(...item.upperCoords);
                allcoords = allcoords.concat(...item.lowerCoords);
                childrenInfo.push(item);
            } else {
                if (!child.noRange) {
                    item.isPolygon = false;
                    item.label = child.label;
                    item.upperCoords = child.coords.map(it => ({ x: Number(new Date(it[0])), y: Number(it[1])}));
                    item.color = child.color;
                    allcoords = allcoords.concat(...item.upperCoords);
                    childrenInfo.push(item);
                }    
            }
        }
        // defining the plot size. We are defining which numbers will appear into the plot
        const rangers = [
            { x: Math.min(...allcoords.map(c => c.x)), y: Math.min(...allcoords.map(c => c.y)) },
            { x: Math.max(...allcoords.map(c => c.x)), y: Math.max(...allcoords.map(c => c.y)) },
        ];

        // this is just a hack to put some branck space in the top of the plot
        rangers[1].y += (.05 * rangers[1].y);

        xAxis.domain(d3.extent(rangers, function (d: Any) { return d.x; }));
        yAxis.domain([Math.min(...rangers.map(x => x.y)), d3.max(rangers, function (d: Any) { return d.y; })]);

        // we are recreating the inner child components by hand injecting some 
        // properties like the svg element and the x and y d3 function.
        const childs = this.createChildren(children, xAxis, yAxis, gridCanvas) as Any;

        const res = {
            gridCanvas : gridCanvas,
            rootCanvas : rootCanvas,
            gridWidth : gridWidth,
            margin : margin,
            gridHeight : gridHeight,
            yAxis : yAxis,
            xAxis : xAxis,
            range : rangers,
            childrenInfo : childrenInfo,
            childs : childs,
        };
        return res;
    }

    render() {
        const d3param = this.getD3RenderParam();
        // the final svg needs to exists before we starts to render the chield components
        setTimeout(() => {
            this.d3render(d3param);
        }, 5);

        const childs = d3param.childs;
        
        // this is the logic that creates the labels bar over the plot
        const plotLabels = (
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <div>
                    {this.getInnerComponents(this.getChildrenAsArray()).filter(ic => ic.label).map((ic, i) =>
                        <div
                            onClick={e => this.handleLabelClick(e, i)}
                            key={`lbl-${i}`}
                            style={{ float: 'left', display: 'block', marginTop: 5, cursor: 'pointer', opacity: this.state.hiddenIndex.indexOf(i) !== -1 ? 0.4 : 1 }}
                        >
                            <div style={{ width: 12, height: 12, backgroundColor: ic.color, display: 'inline-block', marginLeft: 10, marginRight: 5 }} />
                            <span style={{ fontSize: 12 }}>{ic.label}</span>
                        </div>
                    )}
                    <div style={{ float: 'left', display: 'block', marginTop: 5, }}>
                        <div>
                            <input
                                style={{ position: 'relative', top: 2, left: 6, }}
                                type="checkbox"
                                checked={this.state.resize}
                                id={'resize-ckb'}
                                onChange={(event) => this.setState({ resize: !this.state.resize })}
                            />
                            <label style={{ paddingLeft: 12 }} htmlFor={'resize-ckb'}>Resize</label>
                        </div>
                    </div>
                </div>
            </div>
        );

        return (
            <div className={`plot-${this.props.id}-root noselect`} >
                {plotLabels}
                <div 
                    className={`plot-${this.props.id} fadein-plotx`}
                    style={{ position: 'relative', }}
                >
                    {childs}
                </div>
            </div>
        );
    }
}
