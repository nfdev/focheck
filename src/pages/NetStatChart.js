import React from 'react';
import * as d3 from 'd3';

const interval = 5000;
const maxlength = 1000 * 60 * 3 / interval;
const validkeys = [
  "ESTABLISHED",
  "LISTEN",
  "CLOSE_WAIT",
  "REMOVED",
  "SYN_SENT",
  "SYN_RECV",
  "FIN_WAIT1",
  "FIN_WAIT2",
  "TIME_WAIT",
  "CLOSE",
  "LAST_ACK",
  "CLOSING",
  "UNKNOWN",
];

function getTimestamp() {
  let date = new Date();
  let h = date.getHours();
  let m = date.getMinutes();
  let s = date.getSeconds();

  h = (h < 10) ? '0' + h : h;
  m = (m < 10) ? '0' + m : m;
  s = (s < 10) ? '0' + s : s;

  return(h + ':' + m + ':' + s);
}

class NetStatChart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      duration: 1000 * 0.5,
      height: 400,
      width: 600,
    };
    this.svg = React.createRef();
  }

  randomNumberBounds(min, max) {
    return Math.floor(Math.random() * max) + min;
  }

  componentDidMount() {
    console.log("did mount");

    let [width, height] = this.getSize();
    //this.setState({width, height});

    let duration = this.state.duration;

    this.renderInitialize();
    this.renderChart();
  }

  componentDidUpdate() {
    console.log("update");

    let duration = this.state.duration;
    let [width, height] = this.getSize();

    this.renderChart();
  }

  getSize = () => {
    let width = this.svg.current.clientWidth;
    let height = this.svg.current.clientHeight;
    return [width, height];
  }

  renderInitialize = () => {
    let width = this.state.width;
    let height = this.state.height;
    let svg = d3.select(this.svg.current);

    svg.attr("style", "width:100%")
      .attr("height", height);

    svg.append("g")
      .attr("class", "axis x");
    svg.append("g")
      .attr("class", "axis y");

    svg.append("g")
        .attr("class", "BarChart")
      .selectAll("g")
        .data(validkeys).enter().append("g")
            .attr("class", "sessionchart")
  }

  renderChart = () => {
    const {classes, history} = this.props;
    let [width, height] = this.getSize();
    let duration = this.state.duration;
    let margin = {top: 20, right: 20, bottom: 20, left: 20, bar:2};
    let color = d3.schemeCategory10.concat(["#666666","#aaaaaa","#666666", "#aaaaaa"]);
    let barwidth = (width - margin.right - margin.left) / maxlength - margin.bar;
    let movetick = (width - margin.right - margin.left) / maxlength;
    let svg = d3.select(this.svg.current);

    // Axis
    let t = d3.transition().duration(duration).ease(d3.easeLinear);
    let x = d3.scaleTime().rangeRound([margin.left, width - margin.right]);
    let y = d3.scaleLinear().rangeRound([height - margin.bottom, margin.top]);
    let z = d3.scaleOrdinal(color);

    // Data
    var stack = d3.stack().keys(validkeys).order(d3.stackOrderNone).offset(d3.stackOffsetNone);
    let data = history.map(
      function(d){
        let dd = {};
        dd.timestamp = new Date(d.timestamp);
        validkeys.forEach(function(s){
          if (d.stats[s]){
            dd[s] = + d.stats[s];
          }else{
            dd[s] = 0;
          }
        });
        return dd;
      }
    );
    let series = stack(data);

    // Render Axis
    let xmin, xmax, ymin, ymax;
    if (history.length == 0){
      let now = new Date().getTime();
      xmax = now;
      xmin = now - maxlength * interval;
      ymin = 0;
      ymax = 10;
    }else{
      if (history.length < maxlength) {
        xmax = d3.max(history, function(c) { return c.timestamp; });
        xmin = xmax - maxlength * interval;
      }else{
        xmax = d3.max(history, function(c) { return c.timestamp; });
        xmin = d3.min(history, function(c) { return c.timestamp; });
      };

      ymin = 0;
      ymax = d3.max(
        [
          d3.max(series[series.length - 1], function(d) { return d[1]; }),
          10
        ]
      );
    };
    xmax = (new Date(xmax));
    xmin = (new Date(xmin));

    x.domain([xmin, xmax]);
    y.domain([ymin, ymax]);
    z.domain(validkeys);

    svg.select("g.axis.x")
      .attr("transform", "translate(0," + (height - margin.bottom) + ")")
      .transition(t)
      .call(d3.axisBottom(x).ticks(5));
    svg.select("g.axis.y")
      .attr("transform", "translate(" + margin.left + ", 0)")
      .transition(t)
      .call(d3.axisLeft(y));

    // Stack Chart
    let rect = d3.select(".BarChart").selectAll("g").data(series)
                 .style("fill", function(d){ return z(d.key); });
    rect.selectAll("rect").remove();
    rect.selectAll("rect")
      .data(function(d){ return d; }).enter().append("rect")
        .attr("x", function(d) { return x(d.data.timestamp); })
        .attr("y", function(d) { return y(d[1]);})
        .attr("height", function(d) { return y(d[0]) - y(d[1]);})
        .attr("width", barwidth)
        .transition(t)
        .attr("transform", "translate(-" + movetick+  ", 0)");
  }

  render() {
    return (
      <svg ref={this.svg} />
    );
  }
}

export default NetStatChart;
