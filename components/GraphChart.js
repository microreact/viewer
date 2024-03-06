import PropTypes from "prop-types";
import React from "react";
import ReactECharts from "echarts-for-react";

function GraphChart(props) {
  console.log({props})
  const chartData = React.useMemo(
    () => {
      const counts = {};

      for (const row of props.rows) {
        const value = row[props.colourColumnName].length === 40 ? "noval" : row[props.colourColumnName];
        counts[value] = (counts[value] ?? 0) + 1;
      }

      const data = [];

      for (const [value, count] of Object.entries(counts)) {
        data.push({
          id: value,
          name: value,
          symbolSize: count,
        });
      }

      return data;
    },
    [
      props.rows,
      props.colourColumnName,
    ]
  );

  console.log(chartData, props)

  const options = {
    // width: props.width,
    // height: props.height,
    // tooltip: {
    //   position: "top",
    //   formatter(params) {
    //     const [ row, column, value ] = params.data;
    //     return `Row:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<strong>${column}</strong><br />Column: <strong>${row}</strong><br />Value:&nbsp;&nbsp;&nbsp;&nbsp;&thinsp;<strong>${value}${props.labelsUnit}</strong>`;
    //   },
    // },
    grid: {
      containLabel: true,
    },
    // legend: {
    //   show: true,
    // },
    // visualMap: {
    //   type: "continuous",
    //   min: dataRange[0],
    //   max: dataRange[1],
    //   calculable: false,
    //   orient: "horizontal",
    //   left: "center",
    //   bottom: "0",
    //   // hoverLink: false,
    //   // show: false,
    //   // inverse: true,
    //   text: [dataRange[1], dataRange[0]],
    // },
    series: [
      {
        type: "graph",
        layout: "force",
        data: chartData,
        // label: {
        //   show: props.showLabels,
        //   fontSize: props.labelsFontSize,
        //   overflow: props.truncateLabels ? "truncate" : "none",
        //   formatter(args) {
        //     return `${args.value[2]}${props.labelsUnit}`;
        //   },
        // },
        emphasis: {
          disabled: true,
          // itemStyle: {
          //   borderType: "solid",
          //   borderWidth: 1,
          //   borderColor: "black",
          // }
        },
      },
    ],
  };

  return (
    <ReactECharts
      style={{ width: props.width, height: props.height }}
      option={options}
    />
  );
}

GraphChart.propTypes = {
  activeIdsSet: PropTypes.instanceOf(Set).isRequired,
  className: PropTypes.string,
  height: PropTypes.number.isRequired,
  labelsFontSize: PropTypes.number,
  labelsUnit: PropTypes.string,
  matrixData: PropTypes.object,
  matrixId: PropTypes.string.isRequired,
  rotateAxisLabels: PropTypes.number,
  showLabels: PropTypes.bool,
  truncateLabels: PropTypes.bool,
  width: PropTypes.number.isRequired,
};

export default GraphChart;
