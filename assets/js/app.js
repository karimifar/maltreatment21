var apiUrl = 'http://localhost:3306' //'https://texashealthdata.com
var map;
var firstSymbolId;
var hoveredZipId;
var selectedAge ='inf';
var hoveredCtId;
var geoIsZip = false;
var geography= '_cty';
var visible_layer;
var younger = true;

var COLORS = [
    
    '#eee',
    '#e9ddee',
    '#CFB5DB',
    '#A88ED3',
    '#894EC4',
    '#6335BA',
    '#3D1B89',
    '#281C67',
    // '#dcefeb',
    
]
var breaksArr = [-900,-1,-0.5,-0.25,0.25,0.5,1]
var legend =[
    {
        'label': 'Among the lowest',
        'range': [-2,-1],
        'color': COLORS[1]
    },
    {
        'label': 'Comparatively low',
        'range': [-1,-0.5],
        'color': COLORS[2]
    },
    {
        'label': 'Below average',
        'range': [-0.5,-0.25],
        'color': COLORS[3]
    },
    {
        'label': 'Average',
        'range': [-0.25,0.25],
        'color': COLORS[4]
    },
    {
        'label': 'Above average',
        'range': [0.25,0.5],
        'color': COLORS[5]
    },
    {
        'label': 'Comparatively high',
        'range': [0.5,1],
        'color': COLORS[6]
    },
    {
        'label': 'Among the highest',
        'range': [1,2],
        'color': COLORS[7]
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
var mapStyle = "mapbox://styles/karimifar/ck2ey2mad1rtp1cmppck4wq2d";
var mapStyle2 = "mapbox://styles/karimifar/ck2ey2mad1rtp1cmppck4wq2d";

var popup;

function createMap(){
    map = new mapboxgl.Map({
        container: 'map',
        zoom: 4.7,
        center: [-100.000000, 31.000000],
        maxZoom: 12,
        minZoom: 4,
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

        
        
        for (var i=0; i<ageGroups.length; i++){
            addZipLayer(map,ageGroups[i].key)
            addCtyLayer(map,ageGroups[i].key)
            console.log (i)
        }
        
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
            }
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
            var label = e.features[0].properties[labelKey];
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
            var popupHTML = '<p class="zip-name">'+zipcode+'</p>' + '<p class="label">Risk level: '+'<span>'+ label + '</span></p>' + '<p class="score"><span>' + zscore + '</span></p>'
            popup.setLngLat(coordinates).setHTML(popupHTML).addTo(themap);
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
            var label = e.features[0].properties[labelKey];
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
            var popupHTML = '<p class="zip-name">'+cty+'</p>' + '<p class="label">Risk level: '+'<span>'+ label + '</span></p>' + '<p class="score"><span>' + zscore + '</span></p>'
            popup.setLngLat(coordinates).setHTML(popupHTML).addTo(themap);
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
        
    }else{
        geography = '_cty'
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
}





function legend(data){
    var margin = {top: 20, right: 30, bottom: 20, left: 30},
    width = 400,
    height = 100;

    var x = d3.scaleLinear()
        .domain([legend[0].range[0], legend[legend.length-1].range[1]])
        .range([margin.left, width - margin.right])
        console.log([margin.left, width - margin.right])

    var y = d3.scaleLinear()
        .domain([0,1])
        .range([height - margin.bottom, margin.top])
        console.log([height - margin.bottom, margin.top])
    
    

    var legendSvg = d3.select('#legend-wrap')
        .append('svg')
        .attr('viewBox', [0, 0, width ,height ])
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr('id','legend-svg')

    var barH = 30;
    legendSvg.append('g').selectAll('rect')
        .data(legend)
        .enter().append('rect')
        .attr('fill', d => d.color)
            .attr('x', d => x(d.range[0]))
            .attr('y', height-margin.bottom)
            .attr('width', d => x(d.range[1])-x(d.range[0]))
            .transition()
            .duration(1000)
            .attr('y', height - margin.bottom - barH)
            .attr('height', barH)
            // console.log(d => x(d.range[1])-x(d.range[0]))
    legendSvg.append('g').selectAll('.legend-label')
        .data(legend)
        .enter().append('g')
        .attr('class', 'legend-label')
        .attr('transform', d => `translate(${x(  d.range[0]+(d.range[1]-d.range[0])/2)}, ${height - margin.bottom - barH-2} )` )
        .attr('font-size', 7)
        
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
            d3.axisBottom(x)
            .tickPadding(3)
            .tickSize(3)
            .tickSizeInner(3)
            .tickValues([-1,-0.5,-.25,0,0.25,0.5,1])
            .tickFormat(d3.format(10,"f"))
        )
        .call(g => g.select(".domain").remove())
        .attr('font-size', 7)
        .style('font-family', 'aktiv-grotesk-condensed')

    // var xAxisTop = legendSvg.append('g')
    //     .attr("transform", `translate(0,${height-margin.bottom-barH/2})`)
    //     .classed('legend-axis',true)
    //     .call(
    //         d3.axisBottom(x)
    //         .tickPadding(-3)
    //         .tickSize(0)
    //         .tickValues([-0.25,0.25])
    //         .tickFormat(d3.format(10,"f"))
    //     )
    //     .call(g => g.select(".domain").remove())
    //     .attr('font-size', 7)

        

}

legend();

function updateLegend(data){
    var legendSvg = d3.select('#legend-wrap')
    legendSvg.append('g').selectAll('.arrow')
        .data(data)
        .enter().append('line')
            .attr('x1', d => x(d))
            .attr('x2', d => x(d))
            .attr('y1', 100)
            .attr('y1', 200)


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
        // .attr('width', currentWidth)
        .attr('fill', 'red')
        .attr('x', 0)
        .attr('y', (d,i) => i*10)
        .attr('height', 10)
        .transition()
        .duration(1000)
        .attr('width', d => (50*d))
            
    
    

}
// createChart([2,4,7]);


function queryZip(zip){
    
    $.get(apiUrl+'/api/maltreatment/zip/'+zip,function(data){
        console.log(data)
        if(data[0]){
            var ageFilter;
            if(younger){
                ageFilter = 1
            }else{
                ageFilter = 3
            }

            $('.disp-geo').text(zip);
            for(var i=0; i<data.length; i++){
                // console.log(data[i])
                var age = data[i].var_info.age;
                var label = data[i].lbl;
                var value = data[i].value;
                var var_name = data[i].var_name;

                var factor = data[i].var_info.factor;
                var disp_name = data[i].var_info.display_name;
                var description = data[i].var_info.description
                var max_zip = data[i].var_info.max_zip
                var median_zip = data[i].var_info.median_zip
                var min_zip = data[i].var_info.min_zip
                var order = data[i].var_info.order
                var right = data[i].var_info.right
                
                if(age==2 || age == ageFilter){
                    if(factor == selectedAge){//overall score

                        var overallClass= 'risk-'+getInitials(label)
                        if(value){
                            $('#overall-score').text(value)
                            $('#overall-lbl').text(label)
                            $('#content-wrap').attr('class', 'started ' + overallClass)
                            setTimeout(()=>{map.resize()},201);
                        }else{
                            alert('data unavailable')
                        }
                        
                        

                    }
                    // console.log(var_name)

                    if(var_name == 'pop_'+selectedAge){
                        $('#pop-desc').text(disp_name);
                        $('#pop-value').text(Math.round(value));
                    }
                }

            }
        }else{//if no data is returned
            alert('invalid zip')
        }
    })

}



function getInitials(str){
    var matches = str.match(/\b(\w)/g)
    if(matches){
        var acronym = matches.join(''); 
        return acronym;
    } 
}


