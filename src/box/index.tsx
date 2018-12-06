import * as React from 'react';
import * as throttle from 'lodash.throttle';

export interface BoxProps {
    width?: number;
    height?: number;
    useWinWidth?: boolean;
    useWinHeight?: boolean;
    updateOnPageResize?: boolean;
    handleHeight?: (value: number) => number;
    handleWidth?: (value: number) => number;
}

export interface BoxState {
    stWidth: number;
    stHeight: number;
    resizing: boolean;
}

export class Box extends React.Component<BoxProps, BoxState> {
    divElement: HTMLElement | null = null;
    // tslint:disable-next-line:no-any
    timer: any;

    constructor(props: BoxProps) {
        super(props);
        this.state = {
            stWidth: 0,
            stHeight: 0,
            resizing: false,
        };
    }

    componentDidMount() {
        window.addEventListener('resize', this.callResizeUpdate.bind(this));
        window.addEventListener('scroll', this.callScrollUpdate.bind(this));
        this.callResizeUpdate();
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.callResizeUpdate.bind(this));
        window.removeEventListener('scroll', this.callScrollUpdate.bind(this));
    }

    callResizeUpdate() {
        const onUpdate = throttle(this.resizeUpdate.bind(this), 1000);
        onUpdate();
    }

    callScrollUpdate() {
        const onUpdate = throttle(this.scrollUpdate.bind(this), 1000);
        onUpdate();
    }

    getWidth() {
        return this.props.useWinWidth ? window.outerWidth : this.divElement!.clientWidth;
    }

    getHeight() {
        return this.props.useWinHeight ? window.outerHeight : this.divElement!.clientHeight;
    }

    updateSize() {
        if (this.timer) {
            clearTimeout(this.timer);
        }

        this.setState({
            stWidth: 0,
            stHeight: 0,
            resizing: true
        });

        this.timer = setTimeout(() => {
            if (this.divElement) {
                const width = this.getWidth();
                const height = this.getHeight();

                this.setState({
                    stWidth: width,
                    stHeight: height,
                    resizing: false
                });
            }
        }, 10);
    }

    resizeUpdate() {
        if (this.props.updateOnPageResize) {
            this.updateSize();
        } else {
            if (this.divElement) {
                const width = this.getWidth();
                const height = this.getHeight();

                if (width !== this.state.stWidth || height !== this.state.stHeight) {
                    this.updateSize();
                }
            } else {
                this.updateSize();
            }
        }
    }

    scrollUpdate() {
        if (this.divElement) {
            const width = this.getWidth();
            const height = this.getHeight();

            if (width !== this.state.stWidth || height !== this.state.stHeight) {
                this.updateSize();
            }
        } else {
            this.updateSize();
        }
    }
    
    render() {
        const { stWidth, stHeight } = this.state;
        const { children, width, height } = this.props;
        let { handleHeight, handleWidth } = this.props;

        handleHeight = handleHeight || ((v: number) => v);
        handleWidth = handleWidth || ((v: number) => v);

        if (!children) {
            return null;
        }

        // tslint:disable:no-any
        return (
            <div>
                <div ref={(divElement) => this.divElement = divElement} style={{ height: handleHeight(height!) || '100%' }}>
                    {React.cloneElement(children as any, { ...{ width: handleWidth(width || stWidth), height: handleHeight(height || stHeight) } })}
                </div>
                {/* <Tooltip strDate="Date" strTarget={130} strForecast={130} posX={100} posY={300} strTipVisible="block" /> */}
            </div>
        );
    }
}
