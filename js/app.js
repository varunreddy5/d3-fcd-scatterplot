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

var div=d3.select("body")
.append("div")
.classed("tooltip",true)
.style("opacity",0);

var colorScale=["#fa3939","#131a21"];
var legendLabel=["Riders with doping allegations","No doping allegations"];

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
  .call(yAxis)
  .append("text")
  .attr({
    dx:-70,
    dy:20,
    "transform":"translate(0,0) rotate(-90)"
  })
  .text("Ranking");
  
  chart.append("g")
  .classed("x axis",true)
  .attr("transform","translate(0,"+height+")")
  .call(xAxis)
  .append("text")
  .attr({
    "transform":"translate("+width/2+","+"45)",
    "text-anchor":"middle"
  })
  .text("Minutes Behind Fastest Time");
  
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
      return yScale(d.Place);
    },
    r:4,
    fill:function(d,i){
      if(d.Doping!=""){
        return colorScale[0];
      }else{
        return colorScale[1];
      }
    }
  })
  .on("mouseover",function(d){
    div.transition()
    .duration(50)
    .style("opacity",0.7);

    div.html("<span>"+d.Name+":"+d.Nationality+"<br>"
              +"Year: "+d.Year+","+"Time: "+d.Time+"<br><br>"+
              d.Doping+"</span>")
        .style("top",height/2.5+"px")
        .style("left",122+"px");
  })
  .on("mouseout",function(d){
    div.transition()
    .duration(50)
    .style("opacity",0);
  })
  
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
    fill:colorScale[1],
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

  chart.selectAll(".legend")
  .data(legendLabel)
  .enter()
  .append("circle")
  .classed("legend",true);

  chart.selectAll(".legend")
  .attr({
    cx:width-160,
    cy:function(d,i){
      return height/1.5+i*20;
    },
    r:4
  })
  .style("fill",function(d,i){
    return colorScale[i];
  })

  chart.selectAll(".legend")
  .data(legendLabel)
  .exit()
  .remove();

  chart.selectAll(".legend-label")
  .data(legendLabel)
  .enter()
  .append("text")
  .classed("legend-label",true);

  chart.selectAll(".legend-label")
  .attr({
    x:width-150,
    y:function(d,i){
      return height/1.48+i*20;
    },
    "font-size":"12px"
  })
  .text(function(d){
    return d;
  });
  

  chart.selectAll(".legend-label")
  .data(legendLabel)
  .exit()
  .remove();

})

