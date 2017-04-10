var w=1100,
h=580;
var margin={
  top:20,
  right:40,
  bottom:40,
  left:40
};
var width=w-margin.top-margin.bottom,
height=h-margin.right-margin.left;
var svg=d3.select(".chart")
.append("svg")
.attr({
  width:w,
  height:h,
  id:"chart"
});
var chart=svg.append("g")
.attr({transform:"translate("+margin.left+","+margin.top+")"});

function secToMin(time){
  var minutes=Math.floor(time/60);
  var seconds=(time-(minutes*60));
  function formatsec(n){
    return n>9? ""+n:"0"+n;
  }
  return minutes+":"+formatsec(seconds);
}

d3.json("https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/cyclist-data.json",function(error,cycling){
  if(error) throw error;
  console.log(cycling);
  
  //yScale
  var yScale=d3.scale.linear()
  .domain([1,d3.max(cycling,function(d){return d.Place;})+5])
  .range([0,height])
  .nice();
//  console.log(d3.extent(cycling.map(function(d){
//                return secToMin(cycling[cycling.length-1].Seconds-d.Seconds);}));
  //xScale
  var last=cycling[cycling.length-1].Seconds;
  var first=cycling[0].Seconds;
  var xScale=d3.scale.linear()
  .domain([0,last-first+30])
  .range([width-100,0])
  .nice();
  //yAxis
  var yAxis=d3.svg.axis()
  .scale(yScale)
  .orient("left");
  
  var xAxis=d3.svg.axis()
  .scale(xScale)
  .orient("bottom")
  .ticks(5)
  .tickFormat((d,i)=>secToMin(d));
  
  chart.append("g")
  .classed("y axis",true)
  .attr("transform","translate(0,0)")
  .call(yAxis);
  
  chart.append("g")
  .classed("x axis",true)
  .attr("transform","translate(0,"+height+")")
  .call(xAxis);
  
  chart.selectAll(".cyclists")
  .data(cycling)
  .enter()
  .append("circle")
  .classed("cyclists",true);
  
  chart.selectAll(".cyclists-label")
  .data(cycling)
  .enter()
  .append("text")
  .classed("cyclists-label",true);
  
  
  chart.selectAll(".cyclists")
  .attr({
    cx:function(d){
      
      return xScale(d.Seconds-first);
    },
    cy:function(d){
      console.log(yScale(d.Place));
      return yScale(d.Place);
    },
    r:4,
    fill:function(d){
      if(d.Doping!=""){
        return "#fa3939";
      }else{
        return "#131a21";
      }
    }
  });
  
  chart.selectAll(".cyclists-label")
  .attr({
    x:function(d){
      return xScale(d.Seconds-first);
    },
    y:function(d){
      return yScale(d.Place);
    },
    dx:10,
    dy:5,
    fill:"#131a21",
    "font-size":"12px"
  })
  .text(function(d){
    return d.Name;
  });
  chart.selectAll(".cyclists")
  .data(cycling)
  .exit()
  .remove();
  
  chart.selectAll(".cyclists-label")
  .data(cycling)
  .exit()
  .remove();
  
})

