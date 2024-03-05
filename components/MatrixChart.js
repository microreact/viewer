import PropTypes from "prop-types";
import React from "react";
import ReactECharts from "echarts-for-react";

function MattixChart(props) {
  const [ chartData, labels, dataRange ] = React.useMemo(
    () => {
      let min = Number.MAX_SAFE_INTEGER;
      let max = Number.MIN_SAFE_INTEGER;
      const data = [];
      const activeColumns = props.matrixData.columns.filter((x) => props.activeIdsSet.has(x.name));
      for (let yIndex = 0; yIndex < props.matrixData.rows.length; yIndex++) {
        const row = props.matrixData.rows[yIndex];
        for (let xIndex = 0; xIndex < activeColumns.length; xIndex++) {
          const column = activeColumns[xIndex];
          data.push([
            column.name,
            row[props.matrixData.columns[0].name],
            row[column.name],
          ]);
          if (row[column.name] > max) {
            max = row[column.name];
          }
          if (row[column.name] < min) {
            min = row[column.name];
          }
        }
      }
      return [
        data,
        activeColumns.map((x) => x.name),
        [ min, max ],
      ];
    },
    [
      props.activeIdsSet,
      props.matrixData,
    ]
  );

  const options = {
    // width: props.width,
    // height: props.height,
    tooltip: {
      position: "top",
      formatter(params, ticket) {
        const [ row, column, value ] = params.data;
        return `Row:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<strong>${column}</strong><br />Column: <strong>${row}</strong><br />Value:&nbsp;&nbsp;&nbsp;&nbsp;&thinsp;<strong>${value}${props.labelsUnit}</strong>`;
      },
    },
    grid: {
      containLabel: true,
    },
    xAxis: {
      type: "category",
      data: labels,
      splitArea: {
        // show: true
      },
      axisLine: {
        onZero: false,
      },
      position: "top",
      axisLabel : {
        rotate: -1 * props.rotateAxisLabels,
      }
    },
    yAxis: {
      type: "category",
      data: [...labels].reverse(),
      splitArea: {
      },
    },
    legend: {
      show: true,
    },
    visualMap: {
      type: "continuous",
      min: dataRange[0],
      max: dataRange[1],
      calculable: false,
      orient: "horizontal",
      left: "center",
      bottom: "0",
      // hoverLink: false,
      // show: false,
      // inverse: true,
      text: [dataRange[1], dataRange[0]],
    },
    series: [
      {
        name: "",
        type: "heatmap",
        data: chartData,
        label: {
          show: props.showLabels,
          fontSize: props.labelsFontSize,
          overflow: props.truncateLabels ? "truncate" : "none",
          formatter(args) {
            return `${args.value[2]}${props.labelsUnit}`;
          },
        },
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

MattixChart.propTypes = {
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

export default MattixChart;
