import * as React from 'react';

export const NoDataToDisplay: React.StatelessComponent<{ width: number, height: number, text?: string }> = ({ width, height, text }) => {
    return (
        <div 
            style={{
                width,
                height,
                border: '1px solid #d6d6d6',
                textAlign: 'center',
                verticalAlign: 'middle',
                lineHeight: `${height}px`,
                color: 'rgb(160, 160, 160)',
            }}
        >
            {text ? text : 'No data to display'}
        </div>
    );
};
