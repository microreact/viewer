import PropTypes from "prop-types";
import React from "react";
import ReactECharts from "echarts-for-react";
import { hierarchy, pack } from "d3-hierarchy";

// function createTreemapChart() {
//       // dataset: {
//     //   source: nodes
//     // },
//     // series: {
//     //   type: 'custom',
//     //   renderItem: renderItem,
//     //   progressive: 0,
//     //   coordinateSystem: 'none',
//     //   encode: {
//     //     tooltip: 'value',
//     //     itemName: 'id'
//     //   }
//     // },
//     series: (
//       chartType ?
//       {
//         type: 'treemap',
//         id: 'echarts-package-size',
//         animationDurationUpdate: 1000,
//         roam: true,
//         nodeClick: undefined,
//         data: chartData.children,
//         universalTransition: true,
//         label: {
//           show: true
//         },
//         breadcrumb: {
//           show: false
//         },
//         width: "100%",
//         height: "100%",
//         visualDimension: "value",
//         levels: [
//           {
//             itemStyle: {
//               borderWidth: 3,
//               borderColor: '#333',
//               gapWidth: 3
//             }
//           },
//           {
//             visualDimension: 1,
//             // color: ['#942e38', '#aaa', '#269f3c'],
//             colorMappingBy: 'id',
//             // itemStyle: {
//             //   borderWidth: 10,
//             // }
//           }
//         ],
//       }
//       :
//       // {
//       //   type: 'sunburst',
//       //   id: 'echarts-package-size',
//       //   radius: ['20%', '90%'],
//       //   animationDurationUpdate: 1000,
//       //   nodeClick: undefined,
//       //   data: chartData.children,
//       //   universalTransition: true,
//       //   itemStyle: {
//       //     borderWidth: 1,
//       //     borderColor: 'rgba(255,255,255,.5)'
//       //   },
//       //   label: {
//       //     show: false
//       //   }
//       // }
//     ),
// }

function GraphChart(props) {
  const groupedData = React.useMemo(
    () => {
      const counts = {};
      const colours = {};

      for (const row of props.activeRows) {
        const value = row["--microreact-colour-label"].length === 40 ? "novel" : row["--microreact-colour-label"];
        counts[value] = (counts[value] ?? 0) + 1;
        colours[value] = row["--microreact-colour"];
      }

      const data = [];

      for (const [value, count] of Object.entries(counts)) {
        data.push({
          id: value,
          name: value,
          count: count,
          size: count,
          value: count,
          colour: colours[value],
        });
      }

      return {
        id: "root",
        name: "root",
        size: props.activeRows.length,
        value: props.activeRows.length,
        children: data,
      };
    },
    [
      props.activeRows,
    ]
  );

  const graphRoot = React.useMemo(
    () => {
      const root = hierarchy(groupedData);

      root.sum((x) => x.size * 0.5);
      pack()
        .padding(3)
        .size([props.width, props.height])(root);

      return root;
    },
    [
      groupedData,
      props.width,
      props.height,
    ]
  );

  const graphNodes = React.useMemo(
    () => {
      const nodes = [];

      if (graphRoot?.children) {
        for (const child of graphRoot.children) {
          nodes.push({
            x: child.x,
            y: child.y,
            symbolSize: child.r * 2,
            name: child.data.name,
            value: child.data.value,
            itemStyle: {
              color: child.data.colour,
            },
          });
        }
      }

      return nodes;
    },
    [graphRoot],
  );

  const options = {
    series: {
      name: "graph",
      type: "graph",
      layout: "none",
      data: graphNodes,
      roam: true,
      label: {
        show: props.showLabels,
        position: "inside",
        fontSize: 10,
        fontWeight: "bold",
        width: 1,
      },
      selectedMode: "single",
      labelLayout: {
        hideOverlap: true,
        width: 10,
      },
      nodeScaleRatio: 1,
      scaleLimit: {
        min: 1,
        max: 100,
      },
      emphasis: {
        label: { show: true },
        scale: false,
      },
      animationDurationUpdate: 1000,
      universalTransition: true,
    },
    tooltip: {
      position: "top",
      formatter(params) {
        const { name, value } = params.data;
        return `${props.colourColumnName}: <strong>${name}</strong><br />Number of entries: <strong>${value}</strong>`;
      },
    },
  };

  const handleChartClick = (params) => {
    if (params.componentSubType === "graph" && params.componentType === "series") {
      const value = params.data.name;
      props.onClick(null, [ params.event.event, { [props.colourColumnName]: value } ]);
    }
  };

  return (
    <ReactECharts
      style={{ width: props.width, height: props.height }}
      option={options}
      onEvents={{
        "click": handleChartClick,
      }}
    />
  );
}

GraphChart.propTypes = {
  activeRows: PropTypes.array,
  chartId: PropTypes.string.isRequired,
  className: PropTypes.string,
  colourColumnName: PropTypes.string,
  height: PropTypes.number.isRequired,
  onClick: PropTypes.func.isRequired,
  showLabels: PropTypes.bool,
  width: PropTypes.number.isRequired,
};

export default GraphChart;
