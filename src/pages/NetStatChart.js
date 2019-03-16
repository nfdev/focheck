import React from 'react';
import * as d3 from 'd3';

class NetStatChart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      maxlength: 100,
      duration: 500,
      height: 400,
      width: 600,
      validkeys: [
        "listening",
        "connected",
      ],
      dummyhistory: [],
    };
    this.svg = React.createRef();
    //this.seedData= this.seedData.bind(this);
    //this.updateData = this.updateData.bind(this);
  }

  randomNumberBounds(min, max) {
    return Math.floor(Math.random() * max) + min;
  }

  componentDidMount() {
    console.log("did mount");

    let [width, height] = this.getSize();
    //this.setState({width, height});

    this.seedData();
    let duration = this.state.duration;
    let updater = setInterval(this.updateData, duration);
    //let updater = setInterval(this.test01, duration);
    this.setState({
      updater: updater
    });

    this.renderInitialize();
    this.renderChart();
  }

  componentDidUpdate() {
    console.log("update");

    let duration = this.state.duration;
    let [width, height] = this.getSize();

    this.renderChart();
  }


  seedData = () => {
    var now = new Date();
    let history = this.state.dummyhistory;
    let length = this.state.maxlength;
    let duration = this.state.duration;
    for (var i = 0; i < length; ++i) {
      let a = this.randomNumberBounds(0, 10);
      let b = this.randomNumberBounds(0, 20);
      let c = this.randomNumberBounds(0, 40);
      history.push({
        time: new Date(now.getTime() - ((length - i) * duration)),
        listening: a,
        connected: b,
        removed: c,
      });
    }

    this.setState({
      dummyhistory: history,
    });
  }

  updateData = () => {
    var now = new Date();
    let history = this.state.dummyhistory;
    let length = this.state.maxlength;

    history.push({
      time: now,
      listening: this.randomNumberBounds(0, 10),
      connected: this.randomNumberBounds(0, 20),
      removed: this.randomNumberBounds(0, 40)
    });
    if (history.length > length) {
      history.shift();
    }

    this.setState({
      dummyhistory: history,
    });
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

    let history = this.state.dummyhistory;
    let validkeys = this.state.validkeys;
    let stack = d3.stack().keys(validkeys).order(d3.stackOrderNone).offset(d3.stackOffsetNone);
    let series = stack(history);

    let barchart = svg.selectAll(".BarChart")
      .data(series).enter().append("g")
      .attr("class", "g");
  }

  renderChart = () => {
    let [width, height] = this.getSize();
    let duration = this.state.duration;
    let margin = {top: 20, right: 20, bottom: 20, left: 20};
    let color = d3.schemeCategory10;
    let svg = d3.select(this.svg.current);
    let history = this.state.dummyhistory;

    // Axis
    let t = d3.transition().duration(duration).ease(d3.easeLinear);
    let x = d3.scaleTime().rangeRound([0, width-margin.left-margin.right]);
    let y = d3.scaleLinear().rangeRound([height-margin.top-margin.bottom, 0]);
    let z = d3.scaleOrdinal(color);

    // Data
    let validkeys = this.state.validkeys;
    let stack = d3.stack().keys(validkeys).order(d3.stackOrderNone).offset(d3.stackOffsetNone);
    let series = stack(history);

    x.domain([
      d3.min(history, function(c) { return c.time; }),
      d3.max(history, function(c) { return c.time; }),
    ]);
    y.domain([
      0,
      d3.max(series[series.length - 1], function(c) { return c[1]; }),
    ]);
    svg.select("g.axis.x")
      .attr("transform", "translate(0," + (height - margin.bottom-margin.top) + ")")
      .transition(t)
      .call(d3.axisBottom(x).ticks(5));
    svg.select("g.axis.y")
      .transition(t)
      .call(d3.axisLeft(y));

    // Stack Chart
    let barchart = svg.selectAll(".BarChart")
      .data(series).enter().append("g")
      .attr("class", "g");

    barchart.append("rect")
      .attr("x", function(d) { return x(d.date);})
      .attr("y", function(d) { return y(d[0]);})
      .attr("height", function(d) {
        //console.log(d + ":" + d[0] + ":" + d[1] + ":" + y(d[1]));
        return y(d[1]) - y(d[0]);
      })
      .attr("width", 5);
  }

  render() {
    let history = this.props.history;
    return (
      <svg ref={this.svg} />
    );
  }
}

export default NetStatChart;
