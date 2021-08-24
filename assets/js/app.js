var apiUrl =   'https://texashealthdata.com' //'http://localhost:3306' //
var map;
var firstSymbolId;
var hoveredZipId;
var selectedAge ='inf';
var hoveredCtId;
var geoIsZip = false;
var geography= '_cty';
var visible_layer;
var younger = true;
var firstZipQuery = true;
var firstCtyQuery = true;
var query;
var input = document.getElementById("main-input");
var keydownFunc;
var inputFunc;
var acList;
$.get(apiUrl+"/api/alltxcounties", function(data){
    acList = data;
})
function enableTooltips() {
    $('[data-toggle="tooltip"]').tooltip()
}
enableTooltips();
// var COLORS = ["#eee","#aff05b","#60f760","#28ea8d","#1ac7c2","#2f96e0","#5465d6","#6e40aa"]
// var COLORS = ["#eee","#00ff64", "#17a64f", "#237a45", "#423940", "#733568", "#a3248d", "#ff00d2"];
// var COLORS = ["#eee","#00ffaa", "#17a67d", "#237a60", "#403c35", "#783737", "#b02626", "#ff0000"];

// var COLORS = ["#eee","#2799ff", "#3070aa", "#345b80", "#423a3a", "#783737", "#a53636", "#ff3333"];
// var COLORS = [
//     '#eee',
//     '#e9ddee',
//     '#CFB5DB',
//     '#A88ED3',
//     '#894EC4',
//     '#6335BA',
//     '#3D1B89',
//     '#281C67',
// ]
// var COLORS = ["#fff", "#547a99", "#84a7c4", "#9cbdd9", "#d6cdcd", "#eb9b6a", "#e48043","#bf5b1d"];
// var COLORS = ["#eee","#65a5ff", "#5485e1", "#4366c4", "#5b2e73", "#735200", "#b98600", "#ffb900"];
// var COLORS = ["#EEE","#0080ff", "#006dd9", "#005bb2", "#472459", "#800000", "#c40f0f", "#ff4d4d"];
// var COLORS = ["#eee", "#ffc800", "#92781c", "#5c502a", "#45343e", "#80265b", "#aa1970","#ff0099"];
var COLORS  = ["#EEE","#9952ff", "#8337f2", "#6c1be6", "#590e47", "#803800", "#c05600", "#ff7300"];
//edited:
var COLORS  = ["#EEE","#9474f7", "#8337f2", "#5c10ad", "#590e47", "#803800", "#c05600", "#ff7300"];
// var COLORS = ["#eee","#fffcd4", "#ecb29e", "#d86868", "#9b3557", "#872351", "#5e0146", "#420239"];


var arrowColor = '#1A1A1A'
var breaksArr = [-900,-0.9999,-0.4999,-0.2499,0.2501,0.5001,1.001]
var legend =[
    {
        'label': 'Among the lowest',
        'range': [-2,-1],
        'color': COLORS[1],
        'reColor':COLORS[7]
    },
    {
        'label': 'Comparatively low',
        'range': [-1,-0.5],
        'color': COLORS[2],
        'reColor':COLORS[6]
    },
    {
        'label': 'Below average',
        'range': [-0.5,-0.25],
        'color': COLORS[3],
        'reColor':COLORS[5]
    },
    {
        'label': 'Average',
        'range': [-0.25,0.25],
        'color': COLORS[4],
        'reColor':COLORS[4]
    },
    {
        'label': 'Above average',
        'range': [0.25,0.5],
        'color': COLORS[5],
        'reColor':COLORS[3]
    },
    {
        'label': 'Comparatively high',
        'range': [0.5,1],
        'color': COLORS[6],
        'reColor':COLORS[2]
    },
    {
        'label': 'Among the highest',
        'range': [1,2],
        'color': COLORS[7],
        'reColor':COLORS[1]
    },
]
var ageGroups = [
    {
        'key':'inf',
        'name':'Infants',
    },
    {
        'key':'1to4',
        'name':'1 to 4 year olds',
    },
    {
        'key':'5to9',
        'name':'5 to 9 year olds',
    },
    {
        'key':'10to14',
        'name':'10 to 14 year olds',
    },
    {
        'key':'15to17',
        'name':'15 to 17 year olds',
    },
]




mapboxgl.accessToken = "pk.eyJ1Ijoia2FyaW1pZmFyIiwiYSI6ImNqOGtnaWp4OTBjemsyd211ZDV4bThkNmIifQ.Xg-Td2FFJso83Mmmc87NDA";
var mapStyle = "mapbox://styles/karimifar/ckrqtzdew0wvp17s0pyz371ud";
var mapStyle2 = "mapbox://styles/karimifar/ck2ey2mad1rtp1cmppck4wq2d";


var popup;

function createMap(){
    map = new mapboxgl.Map({
        container: 'map',
        zoom: 5,
        center: [-100.000000, 31.000000],
        maxZoom: 12,
        minZoom: 5,
        style: mapStyle
    })

///START OF MAPBOX GL DRAW

    // var draw = new MapboxDraw({
    //     displayControlsDefault: false,
    //     controls: {
    //         polygon: true,
    //         trash: true
    //     },
    //     defaultMode: 'draw_polygon'
    // });
    // map.addControl(draw);

    // map.on('draw.create', updateArea);
    // map.on('draw.delete', updateArea);
    // map.on('draw.update', updateArea);
    
    // function updateArea(e) {
    //     console.log(e)
    //     if(e.features.length>0){
    //         console.log(e.features.length)
    //         var userPolygon = e.features[0]
    //         var polygonBoundingBox = turf.bbox(userPolygon);
    
    //         var southWest = [polygonBoundingBox[0], polygonBoundingBox[1]];
    //         var northEast = [polygonBoundingBox[2], polygonBoundingBox[3]];
    
    //         var northEastPointPixel = map.project(northEast);
    //         var southWestPointPixel = map.project(southWest);
    //         console.log(polygonBoundingBox)
    //         console.log(northEastPointPixel,southWestPointPixel)
    //         console.log(visible_layer)
    //         var features = map.queryRenderedFeatures([southWestPointPixel, northEastPointPixel], { layers: [visible_layer] });
    //         console.log(features.length, features)
    //         var filter = features.reduce(
    //             function (memo, feature) {
    //             memo.push(feature.properties.zcta_int);
    //             return memo;
    //             },
    //             ['in', 'zcta_int']
    //         );
                 
    //         map.setFilter('highlighted_zip', filter);
    //         console.log(filter)
    //         console.log("UNIQ",[...new Set(filter)])
    //     }
        
           
    // }
    
//END OF MAPBOX GL DRAW

    map.on('load', function () {
        var layers = map.getStyle().layers;
        for (var i = 0; i < layers.length; i++) {
            if (layers[i].type === 'symbol') {
                firstSymbolId = layers[i].id;
                break;
            }
        }

        map.addSource("zips", {
            type: "geojson",
            data: apiUrl+ "/maltreatment/zip-map",
            generateId: true,
        })
        map.addSource("counties", {
            type: "geojson",
            data: apiUrl+ "/maltreatment/cty-map",
            generateId: true,
        })
        map.addSource("highways", {
            type: "geojson",
            data: apiUrl+ "/Texas/highways",
            generateId: true,
        })
        map.addSource("rivers", {
            type: "geojson",
            data: apiUrl+ "/Texas/waters/rivers",
            generateId: true,
        })
        map.addSource("lakes", {
            type: "geojson",
            data: apiUrl+ "/Texas/waters/lakes",
            generateId: true,
        })
        map.addSource("bays", {
            type: "geojson",
            data: apiUrl+ "/Texas/waters/bays",
            generateId: true,
        })

        
        
        for (var i=0; i<ageGroups.length; i++){
            addZipLayer(map,ageGroups[i].key)
            addCtyLayer(map,ageGroups[i].key)
        }
        
        
        map.addLayer({
            'id':'rivers',
            'type': 'line',
            'source': 'rivers',
            'paint':{
                'line-color': '#1A1A1A',
                'line-width': 1
            }
        },firstSymbolId)
        map.addLayer({
            'id':'lakes',
            'type': 'fill',
            'source': 'lakes',
            'paint':{
                // 'line-color': 'red',
                // 'line-width':1
                'fill-color': '#1A1A1A',
                'fill-opacity': 0.8   
            }
        },firstSymbolId)
        map.addLayer({
            'id':'bays',
            'type': 'fill',
            'source': 'bays',
            'paint':{
                'fill-color': '#1A1A1A',
                'fill-opacity': 0.8
            }
        },firstSymbolId)

        map.addLayer({
            'id':'highways_minor',
            'type': 'line',
            'source': 'highways',
            'minzoom': 8,
            'paint':{
                'line-color': '#aaa',
                'line-width': 2
            },
            'filter': ['in', 'interstate', 0]
        },firstSymbolId)
        
        map.addLayer({
            'id':'highways',
            'type': 'line',
            'source': 'highways',
            'paint':{
                'line-color': '#888',
                'line-width': [
                    "interpolate", ["linear"], ["zoom"],
                    6,1,
                    10,6
                ]
            },
            'filter': ['in', 'interstate', 1]
        },firstSymbolId)
        
        map.addLayer({
            'id': 'outline_zip',
            'type': 'line',
            'source':'zips',
            'layout':{
                'visibility':'none'
            },
            'paint':{
                "line-color": ["case",
                    ["boolean", ["feature-state", "hover"], false],
                    "#111",
                    "#999"
                ],
                "line-width": [
                    "case",
                    ["boolean", ["feature-state", "hover"], false],
                    1.5,
                    0.3,
                ],
            }
        }, firstSymbolId);

        map.addLayer({
            'id': 'highlighted_zip',
            'type': 'fill',
            'source':'zips',
            'paint':{
                'fill-outline-color': '#222',
                'fill-color': '#1A1A1A',
                'fill-opacity': 0.2
            },
            'filter': ['in', 'zcta_int', '']
        }, firstSymbolId);


        map.addLayer({
            'id': 'outline_cty',
            'type': 'line',
            'source':'counties',
            'layout':{
                'visibility':'none'
            },
            'paint':{
                "line-color": ["case",
                    ["boolean", ["feature-state", "hover"], false],
                    "#111",
                    "#fff"
                ],
                "line-width": ["case",
                    ["boolean", ["feature-state", "hover"], false],
                    1.5,
                    0.3
                ],
            }
        }, firstSymbolId);

        
        visible_layer = 'pred_'+selectedAge+geography
        map.setLayoutProperty(
            visible_layer,
            'visibility',
            'visible'
        )
        updateGeo();
        
        
    })
}


createMap();

function updateControlPos(){
    controlsPos = $('#controls-wrap').offset().top + $('#controls-wrap').outerHeight() -100;
}
updateControlPos();
window.addEventListener('resize', function(event) {
    console.log('resize')
    if(!$('#content-wrap').hasClass('scrolled')){
        updateControlPos();
    }
    setTimeout(()=>{
        map.resize()
    },250);
}, true);

$(window).scroll(function(){
    if(controlsPos){
        if ($(window).scrollTop()>controlsPos){
            $('#content-wrap').addClass('scrolled')
        }else{
            $('#content-wrap').removeClass('scrolled')
        }
    }
    
})

function addZipLayer(themap, key){
    var id = 'pred_' + key;
    var layerId = 'pred_' + key+'_zip';
    themap.addLayer({
        'id':layerId,
        'type': 'fill',
        'source': 'zips',
        'layout': {
            'visibility':'none'
        },
        'paint':{
            'fill-color':[
                'step',
                ['get', id],
                COLORS[0],breaksArr[0],
                COLORS[1],breaksArr[1], 
                COLORS[2],breaksArr[2], 
                COLORS[3],breaksArr[3], 
                COLORS[4],breaksArr[4],
                COLORS[5], breaksArr[5],
                COLORS[6], breaksArr[6],
                COLORS[7]
            ],
            'fill-opacity': 0.9
        }

    },firstSymbolId)

    themap.on("click", layerId, function(e) {
        if(e.features.length >0){
            // if(hoveredZipId>=0){
            //     themap.setFeatureState({source: 'zips', id: hoveredZipId}, { hover: false}); 
            // }
            // themap.getCanvas().style.cursor = "pointer";
            // hoveredZipId = e.features[0].id;
            var zipcode = e.features[0].properties.zcta_int;
            var labelKey = 'lbl_'+id;
            var label = capitalizeFirstLetter(e.features[0].properties[labelKey]) ;
            if(label){
                var color = getColorbyLbl(label,'max')
            }else{
                var color = '#fff'
            }
            
            var zscore = e.features[0].properties[id];
            // var causeName = KEYS[cause_id].name;
            var coordinates = [e.lngLat.lng, e.lngLat.lat];
            // console.log(zipcode)
            popup = new mapboxgl.Popup({
                // closeButton: false,
                // closeOnClick: false,
                offset: [0, -5],
                className: 'zip-pop map-popup'
            });
            // themap.setFeatureState({source: 'zips', id: hoveredZipId}, { hover: true});
            var F4E9E6ML = '<p class="name">'+zipcode+'</p>' + '<p class="label" style="color:'+color+';">'+ label + '</p>' + '<button class="zip-pop-btn pop-submit" data-query="'+zipcode+'" onClick="queryZip('+zipcode+');">Search</button>';
            popup.setLngLat(coordinates).setHTML(F4E9E6ML).addTo(themap);
        }
        
        
    })

    themap.on("mousemove", layerId, function(e) {
        if(e.features.length >0){
            if(hoveredZipId>=0){
                themap.setFeatureState({source: 'zips', id: hoveredZipId}, { hover: false}); 
            }
            themap.getCanvas().style.cursor = "pointer";
            hoveredZipId = e.features[0].id;
            // console.log(zipcode)
            themap.setFeatureState({source: 'zips', id: hoveredZipId}, { hover: true});
        }
        
    })
    themap.on("mouseleave", layerId, function(){
        if(hoveredZipId>=0){
            themap.setFeatureState(
                {source:'zips', id: hoveredZipId},
                {hover: false}
            )
        }
        // popup.remove();
    })
}


function addCtyLayer(themap, key){
    var id = 'pred_' + key;
    var layerId = id+'_cty';
    themap.addLayer({
        'id':layerId,
        'type': 'fill',
        'source': 'counties',
        'layout': {
            'visibility':'none'
        },
        'paint':{
            'fill-color':[
                'step',
                ['get', id],
                COLORS[0],breaksArr[0],
                COLORS[1],breaksArr[1], 
                COLORS[2],breaksArr[2], 
                COLORS[3],breaksArr[3], 
                COLORS[4],breaksArr[4],
                COLORS[5], breaksArr[5],
                COLORS[6], breaksArr[6],
                COLORS[7]
            ],
            'fill-opacity': 0.9
        }

    },firstSymbolId)

    themap.on("click", layerId, function(e) {
        if(e.features.length >0){
            // if(hoveredZipId>=0){
            //     themap.setFeatureState({source: 'zips', id: hoveredZipId}, { hover: false}); 
            // }
            // themap.getCanvas().style.cursor = "pointer";
            // hoveredZipId = e.features[0].id;
            var cty = e.features[0].properties.NAME10;
            var labelKey = 'lbl_'+id;
            var label = capitalizeFirstLetter(e.features[0].properties[labelKey]);
            if(label){
                var color = getColorbyLbl(label,'max')
            }else{
                var color = '#fff'
            }
            var zscore = e.features[0].properties[id];
            // var causeName = KEYS[cause_id].name;
            var coordinates = [e.lngLat.lng, e.lngLat.lat];
            // console.log(zipcode)
            popup = new mapboxgl.Popup({
                // closeButton: false,
                // closeOnClick: false,
                offset: [0, -5],
                className: 'cty-pop map-popup'
            });
            // themap.setFeatureState({source: 'zips', id: hoveredZipId}, { hover: true});
            var popupHTML = '<p class="name">'+cty+'</p>' + '<p class="label" style="color:'+color+';">'+ label + '</p>' + '<button class="cty-pop-btn pop-submit" data-query="'+cty+'">Search</button>'
            popup.setLngLat(coordinates).setHTML(popupHTML).addTo(themap);
            $('.cty-pop-btn').on('click', function(){
                query = $(this).data('query');
                queryCty(query)
            })
        }
        
        
    })

    themap.on("mousemove", layerId, function(e) {
        if(e.features.length >0){
            if(hoveredCtId>=0){
                themap.setFeatureState({source: 'counties', id: hoveredCtId}, { hover: false}); 
            }
            themap.getCanvas().style.cursor = "pointer";
            hoveredCtId = e.features[0].id;
            // console.log(zipcode)
            themap.setFeatureState({source: 'counties', id: hoveredCtId}, { hover: true});
        }
        
    })
    themap.on("mouseleave", layerId, function(){
        if(hoveredCtId>=0){
            themap.setFeatureState(
                {source:'counties', id: hoveredCtId},
                {hover: false}
            )
        }
        // popup.remove();
    })


}

function updateGeo(){
    map.setLayoutProperty(
        'outline'+geography,
        'visibility',
        'none'
    )
    if(geoIsZip){
        geography='_zip';
        input.removeEventListener("input", inputFunc);   
        
    }else{
        geography = '_cty';
        autocomplete(input, acList);
    }
    switchVisibility (visible_layer, 'pred_'+selectedAge+geography)
    map.setLayoutProperty(
        'outline'+geography,
        'visibility',
        'visible'
    )
    

}
function switchAge(){
    selectedAge = $('#ageGroups').val()
    switchVisibility (visible_layer, 'pred_'+selectedAge+geography)
    if(popup){
        popup.remove()
    }
    if(['10to14','15to17'].indexOf(selectedAge)<0){
        younger = true;
    }else{
        younger = false;
    }
}
function switchGeo(){
    geoIsZip = !geoIsZip
    
    updateGeo();
    // map.flyTo({
    //     zoom: 6
    // })
}


function switchVisibility(a,b){
    map.setLayoutProperty(
        a,
        'visibility',
        'none'
    )
    map.setLayoutProperty(
        b,
        'visibility',
        'visible'
    )
    visible_layer = b;
    $('#content-wrap').removeClass('started')
    
    setTimeout(()=>{
        map.resize()
        // mapPin.remove()
        if(popup){
            popup.remove()
        }
        
    },250)
}




var legendX;
var legendY;

function createLegend(data){
    var margin = {top: 20, right: 20, bottom: 40, left: 20},
    width = 500,
    height = 150;
    var barH = 40;

    legendX = d3.scaleLinear()
        .domain([legend[0].range[0], legend[legend.length-1].range[1]])
        .range([margin.left, width - margin.right])
        console.log([margin.left, width - margin.right])

    legendY = d3.scaleLinear()
        .domain([0,2])
        .range([height - margin.bottom, margin.top])
        console.log([height - margin.bottom, margin.top])
    
    

    var legendSvg = d3.select('#legend-wrap')
        .append('svg')
        .attr('viewBox', [0, 0, width ,height ])
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr('id','legend-svg')

    legendSvg.append('g').selectAll('rect')
        .data(legend)
        .enter().append('rect')
        .attr('fill', d => d.color)
            .attr('x', d => legendX(d.range[0]))
            .attr('y', height-margin.bottom)
            .attr('width', d => legendX(d.range[1])-legendX(d.range[0]))
            .transition()
            .duration(1000)
            .attr('y', height - margin.bottom - barH)
            .attr('height', barH)
            // console.log(d => x(d.range[1])-x(d.range[0]))
    legendSvg.append('g').selectAll('.legend-label')
        .data(legend)
        .enter().append('g')
        .attr('class', 'legend-label')
        .attr('transform', d => `translate(${legendX(  d.range[0]+(d.range[1]-d.range[0])/2)}, ${height - margin.bottom - barH-5} )` )
        .attr('font-size', '9px')
        
        .append('text')

        .text(d => d.label)
        .style('opacity', 0)
        .attr('transform', 'rotate(-30)')
        .transition()
        .duration(500)
        .delay(500)
        .style('opacity', 1)
        // .style("text-anchor", "middle")
        
        // .attr('transform-origin', '50% 50%')


    var xAxisBottom = legendSvg.append('g')
        .attr("transform", `translate(0,${height-margin.bottom})`)
        .classed('legend-axis',true)
        .call(
            d3.axisBottom(legendX)
            .tickPadding(3)
            .tickSize(3)
            .tickSizeInner(3)
            .tickValues([-1,-0.5,-.25,0,0.25,0.5,1])
            .tickFormat(d3.format(10,"f"))
        )
        .call(g => g.select(".domain").remove())
        .attr('font-size', '9px')
        .style('font-family', 'aktiv-grotesk-condensed')

    //I'm 
    var markerBoxWidth = 6
    var markerBoxHeight = 10
    var refX = 5;
    var refY = 5;
    var arrowPoints = [[1, 1], [5, 5], [1, 9],];
    
    legendSvg.append('defs')
        .append('marker')
        .attr('id', 'arrow')
        .attr('viewBox', [0,0,markerBoxWidth,markerBoxHeight])
        .attr('refX', refX)
        .attr('refY', refY)
        .attr('markerWidth', markerBoxWidth)
        .attr('markerHeight', markerBoxHeight)
        .attr('orient', 'auto-start-reverse')
        .append('path')
        .attr('d', d3.line()(arrowPoints))
        .attr('stroke', arrowColor)  
        .style('fill', 'none')  
        // .style('stroke-width', 2);    
}

createLegend();

function updateLegend(data){
    var legendSvg = d3.select('#legend-wrap svg')
    
    var line = legendSvg.selectAll('line.arrow')
        .data(data)
        // .join()
        // line.exit().remove()
        line.enter().append('line')
            .attr('x1', legendX(0))
            .attr('x2', legendX(0))
            .attr('y1', legendY(-0.8))
            .attr('y2', legendY(0.95))
            .attr('marker-start', 'url(#arrow)')
            // .style('stroke-width', '2px')
        .merge(line)
            .transition()
            .ease(d3.easeExpInOut)
            .duration(1000)
            .attr('x1', d => legendX(d))
            .attr('x2', d => legendX(d))
            .attr('y1', legendY(-0.8))
            .attr('y2', legendY(0.95))
            .attr('class', 'arrow')
            .style('stroke', arrowColor)

}

function getColorbyLbl(lbl,right){
    if(right =='max'){
        var legendItems =  legend.filter(legend => legend.label.toLowerCase() == lbl.toLowerCase())
        if(legendItems[0]){
            return legendItems[0].color;
        }
    }else{
        var legendItems = legend.filter(legend => legend.label.toLowerCase() == lbl.toLowerCase())
        if(legendItems[0]){
            return legendItems[0].reColor;
        }
    }
}








// $('#legend-wrap').append('<svg id="svg">')
function createChart(data){

    var svg = d3.select('#svg')

    var margin = {top: 10, right: 10, bottom: 50, left: 50};

    var width = svg.attr('width') - margin.left - margin.right;
    var height = svg.attr('height') - margin.top - margin.bottom;

    svg.attr('viewBox', [0, 0, 300 ,200 ])
        .attr("preserveAspectRatio", "xMinYMin meet")

    var bar = svg.selectAll('rect')
        .data(data)
        bar.exit().transition().duration(500).attr('width', 0).remove();

        console.log(bar)
        bar.enter().append('rect')
        .merge(bar)
        .transition()
        .duration(500)
        .attr('fill', 'red')
        .attr('x', 0)
        .attr('y', (d,i) => i*10)
        .attr('height', 10)
        .transition()
        .duration(1000)
        .attr('width', d => (50*d))
            
    
    

}
// createChart([2,4,7]);

var mapPin = new mapboxgl.Marker();




function getInitials(str){
    var matches = str.match(/\b(\w)/g)
    if(matches){
        var acronym = matches.join(''); 
        return acronym;
    } 
}


$('#submit').on('click', function(e){
    e.preventDefault();
    query = $('#main-input').val();
    
    if (geoIsZip){
        queryZip(query)
    }else{
        queryCty(query)
    }
})


// queryZip('78721')
function createRiskChart(min,max,median,val,divId,color,right,barH){
    var id = divId
    var margin = {top: 10, right: 30, bottom: 35, left: 30};
    var width = 500;
    var height = 75;
    // var barH = 15;
    var startX;

    var upperDev = max-median;
    var lowerDev = median-min;
    var diff = Math.abs(upperDev-lowerDev)
    var dMin=min;
    var dMax=max;
    if(upperDev>lowerDev){
        dMin = min-diff;
    }else{
        dMax = max+diff
    }


    var domain = [dMin,dMax]
    if(right == 'min'){
        domain=[dMax,dMin]
    }
    var ticks = [min,max]
    // if(min<0){ticks.push(0)}
    var X = d3.scaleLinear()
        .domain(domain)
        .range([margin.left, width-margin.right])
    var Y = d3.scaleLinear()
        .domain([0,1])
        .range([height-margin.bottom, margin.top])
    if(val[0]<median && right == 'max'){
        startX = X(val[0])
    }
    if(val[0]<median && right == 'min'){
        startX = X(median)
    }
    if(val[0]>median && right == 'min'){
        startX = X(val[0])
    }
    if(val[0]>median && right == 'max'){
        startX = X(median)
    }

    console.log(val[0],median)
    var svg = d3.select('#'+id+'-svg-wrap')
        .append('svg')
        .attr('viewBox', [0,0,width,height])
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr('id',id + '-svg')

    var markerBoxWidth = 6
    var markerBoxHeight = 10
    var refX = 5;
    var refY = 5;
    var arrowPoints = [[1, 1], [5, 5], [1, 9],];
    
    svg.append('defs')
        .append('marker')
        .attr('id', 'med-arrow')
        .attr('viewBox', [0,0,markerBoxWidth,markerBoxHeight])
        .attr('refX', refX)
        .attr('refY', refY)
        .attr('markerWidth', markerBoxWidth)
        .attr('markerHeight', markerBoxHeight)
        .attr('orient', 'auto-start-reverse')
        .append('path')
        .attr('d', d3.line()(arrowPoints))
        .attr('stroke', '#666')  
        .style('fill', 'none')  

    

    svg.append('g')
        .attr("transform", `translate(0,${height-margin.bottom-barH/2-5})`)
        .classed('risk-axis',true)
        .call(
            d3.axisBottom(X)
            .tickPadding(barH/2-1)
            .tickSize(10)
            .tickSizeOuter(0)
            .tickValues(ticks)
            .tickFormat(d3.format(10,"f"))
        )
        
        .call(g => g.select(".domain")
            .attr('transform', 'translate(0,5)')
            .style('stroke', '#ddd')
            .style('stroke-width', 0.5)
        )
        .call(g => g.select(".domain")
            
        )
        .attr('font-size', '8px')
        .style('font-family', 'aktiv-grotesk-condensed')
        .style('fill', '#666')

    svg.append('g')
        .append('line')
        .attr('x1', X(min))
        .attr('x2', X(max))
        .attr('y1', height-margin.bottom-barH/2)
        .attr('y2', height-margin.bottom-barH/2)
        .attr('class', 'axis-line')
        .style('stroke-width',0.5)
        .style('stroke', '#888')
    
        
    svg.append('g').selectAll('rect')
        .data(val)
        .enter().append('rect')
            .attr('fill', color)
            .attr('x',X(median))
            .attr('y', height-margin.bottom-barH)
            .attr('height', barH)
            .transition()
            .duration(1000)
            .attr('width', d => Math.abs(X(d)-X(median)))
            .attr('x', startX)
    
    svg.selectAll('.median-mark')
        .data([median]).enter()
        .append('g')
        .attr('class', 'median-mark')
        .append('line')
        
        .attr('y1', height-margin.bottom+6)
        .attr('y2', height-19)
        .attr('x1', X(median))
        .attr('x2', X(median))
        .style('stroke', '#666')
        .style('stroke-width', 0.5)
        .attr('marker-start', 'url(#med-arrow)')

    svg.selectAll('.median-mark')
        .append('line')
        .attr('y1', height-margin.bottom-barH-2)
        .attr('y2', height-margin.bottom+2)
        .attr('x1', X(median))
        .attr('x2', X(median))
        .style('stroke', '#000')
        
    svg.selectAll('.median-mark')
        .append('text')
        .text('STATE MEDIAN')
        .attr('x', X(median))
        .attr('y', height-12)
        .attr("text-anchor", "middle")
        .style('font-size', '6px')
        .style('fill', '#666')

    svg.selectAll('.median-mark')
        .append('g')
        .attr('class', 'state-med-rate')
        .append('text')
        .text(median)
        
        .attr('x', X(median))
        .attr('y', height-2)
        .style('font-size', '8px')
        .attr("text-anchor", "middle")
        // .style('display', 'none')
        
            
    svg.selectAll('.rate-label')
        .data(val).enter()
        .append('g').attr('class', 'rate-label')
        .append('text')
        .text(d => d)
        .attr("text-anchor", "middle")
        .style('opacity', 0)
        .style('font-family', 'aktiv-grotesk-condensed, sans-serif')
        .style('font-size', '12px')
        .attr('transform', d =>`translate(${X(d)},${height-margin.bottom-barH-5})`)
        .transition()
        .duration(1000)
        .style('opacity', 1)
    svg.selectAll('.rate-label')
        .append('line')
        .attr('y1', height-margin.bottom-barH-3)
        .attr('y2', height-margin.bottom-barH/2)
        .attr('x1', d=>X(d))
        .attr('x2', d=>X(d))
        .style('stroke', '#aaa')
        .style('stroke-width', 0.5)
        .style('opacity', 0)
        .transition()
        .duration(1000)
        .style('opacity', 1)
}



function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

//TO TOGGLE THE DROPDOWNS OPEN AND COLLAPSE:
//$('.drop-wrap').collapse('toggle')