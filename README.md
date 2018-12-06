# D3 Chart UI
For analising market purchasing power, fan chart and tooltip is used.
* Source code path: `src/charts`
* Storybook code path: `stories/charts`

## Installation

To run this project, yarn have to be installed first.

## Screenshot
![alt text](https://github.com/crystalmanner/react-d3-tooltip-project/blob/master/screenshot/Screenshot.png)

## Input data format
```typescript
const data = {
    'P97.5': [['2018-03-01', 145.0], ['2018-05-01', 250.0], ['2018-07-01', 260.0], ['2018-09-01', 262.0], ['2018-10-01', 262.0]],
    'P87.5': [['2018-03-01', 145.0], ['2018-05-01', 200.0], ['2018-07-01', 210.0], ['2018-09-01', 222.0], ['2018-10-01', 230.0]],
    'P12.5': [['2018-03-01', 145.0], ['2018-05-01', 160.0], ['2018-07-01', 170.0], ['2018-09-01', 185.0], ['2018-10-01', 182.0]],
    'P2.5': [['2018-03-01', 145.0], ['2018-05-01', 130.0], ['2018-07-01', 140.0], ['2018-09-01', 132.0], ['2018-10-01', 122.0]],
    'history': [['2018-01-01', 0.0], ['2018-02-01', 80.0], ['2018-03-01', 145.0], ['2018-05-01', 175.0], ['2018-07-01', 190.0], ['2018-09-01', 200.0], ['2018-10-01', 212.0]],
    'target': [['2018-03-01', 125.0], ['2018-05-01', 165.0], ['2018-07-01', 185.0], ['2018-09-01', 220.0], ['2018-10-01', 225.0]],
    'verticalLine' : [['2018-03-01', 0], ['2018-03-01', 280.0]],
 };
```

## Build
This script will install all the project dependencies, compile the code and create a docker image with a local webserver.

    bash build.sh

> The build script will work only on linux. (maybe on mac, I've never tried)

**Useful commands**
- `npm run storybook` - Start the storybook app
- `npm run build-storybook` - Compile the Storybook app
