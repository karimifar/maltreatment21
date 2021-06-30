var map;
var firstSymbolId;
var hoveredZipId;
var selectedAge ='inf';
var hoveredCtId;
var geoIsZip = false;
var geography= '_cty';
var visible_layer;
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
var legend = {
    1: {'name': '<10% above state rate', 'color':COLORS[0]},
    2: {'name': '<10-20% above state rate', 'color':COLORS[1]},
    3: {'name': '<20-30% above state rate', 'color':COLORS[2]},
    4: {'name': '<30-40% above state rate', 'color':COLORS[3]},
    5: {'name': '<40%-50% above state rate', 'color':COLORS[4]},
    6: {'name': '50% or more above state rate', 'color':COLORS[5]},
    7: {'name': 'Suppressed value', 'color':COLORS[6]},
    8: {'name': 'Unreliable value', 'color':COLORS[7]},
    9: {'name': 'Below state rate', 'color':COLORS[8]},

}
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
        zoom: 5,
        center: [-100.000000, 31.000000],
        maxZoom: 10,
        minZoom: 1,
        style: mapStyle
    })
    

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
            data: "https://texashealthdata.com/maltreatment/zip-map",
            generateId: true,
        })
        map.addSource("counties", {
            type: "geojson",
            data: "https://texashealthdata.com/maltreatment/cty-map",
            generateId: true,
        })

        
        
        for (var i=0; i<ageGroups.length; i++){
            addZipLayer(map,ageGroups[i].key)
            addCtyLayer(map,ageGroups[i].key)
            console.log (i)
        }
        

        
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
                "line-width": ["case",
                    ["boolean", ["feature-state", "hover"], false],
                    1.5,
                    0.3
                ],
            }
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
}
function switchGeo(){
    geoIsZip = !geoIsZip
    updateGeo();
}

$('#togBtn').on('click', switchGeo)
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