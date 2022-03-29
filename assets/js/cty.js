function queryCty(cty){
    $('#main-input').val(cty)
    $.get(apiUrl+'/api/maltreatment/'+year+'/cty/'+cty,function(data){
        console.log(data)
        $.get(apiUrl+'/api/validatecty/'+cty,function(counties){
            if(counties[0]){
                setTimeout(()=>{
                    map.resize()
                    var c_lat = counties[0].c_lat
                    var c_lng = counties[0].c_lng
                    map.flyTo({
                        center: [c_lng,c_lat],
                        zoom: 7.5
                    })
                    mapPin.setLngLat([c_lng,c_lat])
                        .addTo(map);
                },250);
                if(data[0]){
                    cty = data[0].county
                    query=cty
                    if(!$('#content-wrap').hasClass('scrolled')){
                        updateControlPos();
                    }
                    $('#risks-table').empty();
                    var ageFilter;
                    if(younger){
                        ageFilter = 1
                    }else{
                        ageFilter = 3
                    }
        
                    //test for filtering https://www.javascripttutorial.net/javascript-array-filter/
                    var agedData = data.filter(variable => variable.var_info.age ==2 ||variable.var_info.age == ageFilter)
                    var agedState = stateValues.filter(variable => variable.var_info.age ==2 ||variable.var_info.age == ageFilter)
        
                    for(var i=0; i<agedData.length; i++){
                        agedData[i].state = agedState[i]
                        var label = agedData[i].lbl;
                        var right = agedData[i].var_info.right
                        var value = agedData[i].value;
                        if(label){
                            var color = getColorbyLbl(label, right)
                        }
                        
                        var var_name = agedData[i].var_name;
        
                        var factor = agedData[i].var_info.factor;
                        var disp_name = agedData[i].var_info.display_name;
        
                        
                        if(factor == selectedAge){//overall score
                            console.log(var_name,label)
                            $('.text-dyno-color').css('color', color)
                            $('.bg-dyno-color').css('background-color', color)
                            var overallClass= 'risk-'+getInitials(label)
                            if(value){
                                $('#overall-score').text(value)
                                updateLegend([value])
                                $('#overall-lbl').text(label)
                                $('#content-wrap').attr('class', 'started ' + overallClass)
                                
                                
                            }else{
                                alert('Data not available for this age group')
                                $('#content-wrap').removeClass('started')
                                setTimeout(()=>{
                                    map.resize()
                                },250);
                            }
                            
                        }
        
                        if(var_name == 'pop_'+selectedAge){
                            $('#pop-desc').text(disp_name);
                            $('#pop-value').text(Math.round(value));
                        }
                    }
                    if(younger){
                        var mainFactors = agedData.filter(variable => variable.var_info.factor == 'factor')
                        .sort((v1,v2) => v1.var_info.order - v2.var_info.order)
                    }else{
                        var mainFactors = agedData.filter(variable => older_variables.indexOf(variable.var_info.factor)>=0)
                        .sort((v1,v2) => v1.var_info.order - v2.var_info.order)
                    }
                    
                    mainFactors.map(v => {
                        var label = capitalizeFirstLetter(v.lbl);
                        
                        var value = v.value;
                        var disp_name = v.var_info.display_name;
                        var description = v.var_info.description
                        var max_cty = v.state.max_cty
                        var median_cty = v.state.median_cty
                        var min_cty = v.state.min_cty
                        var order = v.var_info.order
                        var right = v.var_info.right
                        var var_name = v.var_name;
                        //getting underlying variables
                        if(label){
                            var color = getColorbyLbl(label,right);
                        }
                        var underlyingArr = agedData.filter(v => v.var_info.factor == var_name)
                            .sort((v1,v2) => v1.var_info.order - v2.var_info.order)
                        
                        
                        var factor_layer = $('<div class="dashboard-layer factor-layer" id="'+var_name+'">')
                        var factor_Info = $('<div class="risk-factor">')
                        var risk_chart = $('<div class="risk-chart chart-wrap">')
                            .append('<div class="risk-svg-wrap" id="'+var_name+'-svg-wrap">')
        
                        if(underlyingArr[0]){
                            var drop_id = var_name+'-under'
                            var drop_layer = $('<div id="'+drop_id+'" class="collapse drop-wrap">')
                            var risk_name = $('<h3><i class="fas fa-caret-right"></i> '+disp_name+': </h3>')
                            var factor_wrap = $('<div class="factor-wrap factor_drop collapsed" data-toggle="collapse" data-target="#'+drop_id+'" aria-expanded="false" aria-controls="'+drop_id+'" title="Click to see underlying variables">')
                            factor_layer.addClass('factor-layer-drop')
                        }else{
                            var factor_wrap = $('<div class="factor-wrap">')
                            var risk_name = $('<h3>'+disp_name+': </h3>')   
                        }
                        
                        risk_name.append('<span class="desc-tooltip" data-toggle="tooltip" data-html="true" title="'+description+'"><i class="fas fa-info-circle"></i></span>')
        
                        var risk_title = $('<div class="risk-title">')
                            .append(risk_name)
                        factor_Info.append(risk_title)
                            .append(risk_chart)
                        var risk_level = $('<div class="risk-level">')
                            .append('<div class="risk-color" style="background-color:'+color+'">')
                            .append('<p>'+label+'</p>')
                        factor_wrap.append(factor_Info).append(risk_level)
                        factor_layer.append(factor_wrap)
                        $('#risks-table').append(factor_layer)
                        if(drop_layer){
                            factor_layer.append(drop_layer)
                        }
                        underlyingArr.map( v => {
        
                            var label = capitalizeFirstLetter(v.lbl);
                            var value = v.value;
                            var disp_name = v.var_info.display_name;
                            var description = v.var_info.description
                            var max_cty = v.state.max_cty
                            var median_cty = v.state.median_cty
                            var min_cty = v.state.min_cty
                            var order = v.var_info.order
                            var right = v.var_info.right
                            var var_name = v.var_name;
                            //getting underlying variables
                            if(label){
                                var color = getColorbyLbl(label,right);
                            }
                            var drop_wrap = $('<div class="factor-wrap">');
                            var drop_info = $('<div class="risk-factor">')
                            var risk_chart = $('<div class="risk-chart chart-wrap">')
                                .append('<div class="risk-svg-wrap" id="'+var_name+'-svg-wrap">')
                            var risk_name = $('<h3>'+disp_name+': </h3>')
                                .append('<span class="desc-tooltip" data-toggle="tooltip" data-html="true" title="'+description+'"><i class="fas fa-info-circle"></i></span>')
                            var risk_title = $('<div class="risk-title">')
                                .append(risk_name)
                            drop_info.append(risk_title)
                                .append(risk_chart)
                            var risk_level = $('<div class="risk-level">')
                                .append('<div class="risk-color" style="background-color:'+color+'">')
                                .append('<p>'+label+'</p>')
                            drop_wrap.append(drop_info).append(risk_level)
                            drop_layer.append(drop_wrap)
                            if(value){
                                console.log(disp_name, value)
                                createRiskChart(parseFloat(min_cty),parseFloat(max_cty),parseFloat(median_cty),[parseFloat(value)],var_name,color,right,7)
                            }else{
                                console.log(disp_name, value)
                                $('#'+var_name+'-svg-wrap').append('<p class="nodata-chart">Data are estimated but not available for 2019</p>')
                            }
                        })
                        
                        createRiskChart(parseFloat(min_cty),parseFloat(max_cty),parseFloat(median_cty),[parseFloat(value)],var_name,color,right,15)
        
                    })
                    enableTooltips();
                    if ($(window).scrollTop()>controlsPos){
                        $('#content-wrap').addClass('scrolled')
                    }
                    //end of new method
                    $('.disp-geo').text(query+' county');
        
                    $('#lower-content .button-group').empty()
                    var buttonGroup = $('#lower-content .button-group')
                    buttonGroup.append('<button><a target="_blank" href="'+apiUrl+'/api/maltreatment/csv/'+year+'/cty/'+query+'"><i class="fas fa-table"></i> Download data for '+query+' county</a></button>')
                    buttonGroup.append('<button><a target="_blank" href="./assets/files/mltrisk2019_codebook.xlsx"><i class="fas fa-book"></i> Data dictionary</a></button>')
        
                }else{//if no data is returned
                    alert('Risk not calculated for '+cty)
                }
            }else{
                alert(cty + ' is not a valid Texas county.')
            }
            
        })
        
    })

}