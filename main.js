


function togglePieBar(id) {
       var e = document.getElementById(id);
       var c = document.getElementById("barcharthere");
       if(e.style.display !== 'none') {
        e.style.display = 'none';
        c.style.display = 'block';
        }
       else {
        e.style.display = 'block';
        c.style.display = 'none';
   }    
}

/*
The purpose of this demo is to demonstrate how multiple charts on the same page
can be linked through DOM and Highcharts events and API methods. It takes a
standard Highcharts config with a small variation for each data set, and a
mouse/touch event handler to bind the charts together.
*/


/**
 * In order to synchronize tooltips and crosshairs, override the
 * built-in events with handlers defined on the parent element.
 */

var x_idx_power;
['mousemove', 'touchmove', 'touchstart'].forEach(function (eventType) {
    [document.getElementById('generation').addEventListener(
        eventType,
        function (e) {
            var chart,
                point,
                i,
                event;

            for (i = 0; i < Highcharts.charts.length; i = i + 1) {
                chart = Highcharts.charts[i];
                // Find coordinates within the chart
                event = chart.pointer.normalize(e);
                // Get the hovered point
                point = chart.series[0].searchPoint(event, true);

                if (i == 2) {
                    x_idx_power = point.index
                }

                if (point) {
                    point.highlight(e);
                }
                updateLegend(x_idx_power);
            }
        }
    ),
    document.getElementById('price').addEventListener(
        eventType,
        function (e) {
            var chart,
                point,
                i,
                event;

            for (i = 0; i < Highcharts.charts.length; i = i + 1) {
                chart = Highcharts.charts[i];
                // Find coordinates within the chart
                event = chart.pointer.normalize(e);
                // Get the hovered point
                point = chart.series[0].searchPoint(event, true);
                
                if (i == 2) {
                    x_idx_power = point.index
                }

                if (point) {
                    point.highlight(e);
                }
                updateLegend(x_idx_power);
            }
        }
    ),
    document.getElementById('temperature').addEventListener(
        eventType,
        function (e) {
            var chart,
                point,
                i,
                event;

            for (i = 0; i < Highcharts.charts.length; i = i + 1) {
                chart = Highcharts.charts[i];
                // Find coordinates within the chart
                event = chart.pointer.normalize(e);
                // Get the hovered point
                point = chart.series[0].searchPoint(event, true);

                if (i == 2) {
                    x_idx_power = point.index
                }

                if (point) {
                    point.highlight(e);
                }
                updateLegend(x_idx_power);
            }
        }
    )]

});



/**
 * Override the reset function, we don't need to hide the tooltips and
 * crosshairs.
 */
Highcharts.Pointer.prototype.reset = function () {
    return undefined;
};

/**
 * Highlight a point by showing tooltip, setting hover state and draw crosshair
 */
Highcharts.Point.prototype.highlight = function (event) {
    event = this.series.chart.pointer.normalize(event);
    this.onMouseOver(); // Show the hover marker
    this.series.chart.tooltip.refresh(this); // Show the tooltip
    this.series.chart.xAxis[0].drawCrosshair(event, this); // Show the crosshair
};

/**
 * Synchronize zooming through the setExtremes event handler.
 */
function syncExtremes(e) {
    var thisChart = this.chart;

    if (e.trigger !== 'syncExtremes') { // Prevent feedback loop
        Highcharts.each(Highcharts.charts, function (chart) {
            if (chart !== thisChart) {
                if (chart.xAxis[0].setExtremes) { // It is null while updating
                    chart.xAxis[0].setExtremes(
                        e.min,
                        e.max,
                        undefined,
                        false,
                        { trigger: 'syncExtremes' }
                    );
                }
            }
        });
    }
};

// Get the data. The contents of the data file can be viewed at
var divs = ['generation', 'price', 'temperature'];


// TEMPERATURE GRAPH
Highcharts.ajax({
    url: 'springfield.json',//'https://cdn.jsdelivr.net/gh/highcharts/highcharts@v7.0.0/samples/data/activity.json',
    dataType: 'text',
    success: function (datasets) {

        datasets = JSON.parse(datasets);
        dataset = datasets[10];

        var chartDiv = document.getElementById('temperature'); //document.createElement('div');
            
        Highcharts.chart(chartDiv, {
            chart: {
                marginLeft: 50, // Keep all charts left aligned
                spacingTop: 10,
                spacingRight: 40,
                spacingBottom: 20
            },
            title: {
                text: 'Temperature (°F)',
                align: 'left',
                margin: 0,
                x: 30
            },
            credits: {
                enabled: false
            },
            legend: {
                enabled: false
            },
            xAxis: {
                type: 'datetime',
                crosshair: true,
                events: {
                    setExtremes: syncExtremes
                },
                labels: {
                    enabled: true,
                    // format: '{value}'
                }
            },
            yAxis: {
                gridLineDashStyle: 'longdash',
                minorTickInterval: '0.2',
                tickAmount: 5,
                min: 0,
                ceiling: 100,
                title: {
                    text: null
                },
            },
            tooltip: {
                positioner: function () {
                    return {
                        // right aligned
                        x: this.chart.chartWidth - this.label.width - 50,
                        y: 10 // align to title
                    };
                },
                borderWidth: 0,
                backgroundColor: 'none',
                pointFormat: '{point.y}',
                headerFormat: '',
                shadow: false,
                style: {
                    fontSize: '18px'
                },
                valueDecimals: dataset.valueDecimals
            },
            series: [{
                data: dataset.history.data,
                name: dataset.id,
                pointStart: dataset.history.start*1000,
                pointInterval: 1000*60*30,
                type: "line",
                color: Highcharts.getOptions().colors[1],
                fillOpacity: 0.3,
                tooltip: {
                    valueSuffix: ' ' +  '°F'//dataset.unit
                }
            }]
        })
    }
});
var price = [];
// PRICE GRAPH
Highcharts.ajax({
    url: 'springfield.json',//'https://cdn.jsdelivr.net/gh/highcharts/highcharts@v7.0.0/samples/data/activity.json',
    dataType: 'text',
    success: function (datasets) {

        datasets = JSON.parse(datasets);
        dataset = datasets[8];
        price = dataset;

        var chartDiv = document.getElementById('price'); //document.createElement('div');
            
        Highcharts.chart(chartDiv, {
            chart: {
                marginLeft: 50, // Keep all charts left aligned
                spacingTop: 10,
                spacingRight: 40,
                spacingBottom: 20
            },
            title: {
                text: 'Price ($/MWh)',
                align: 'left',
                margin: 0,
                x: 30
            },
            credits: {
                enabled: false
            },
            legend: {
                enabled: false
            },
            xAxis: {
                type: 'datetime',
                crosshair: true,
                events: {
                    setExtremes: syncExtremes
                },
                labels: {
                    enabled: false,
                    // format: '{value}'
                }
            },
            yAxis: {
                gridLineDashStyle: 'longdash',
                minorTickInterval: '0.2',
                tickAmount: 5,
                min: 0,
                max:300,
                ceiling: 300,
                title: {
                    text: null
                },
            },
            tooltip: {
                positioner: function () {
                    return {
                        // right aligned
                        x: this.chart.chartWidth - this.label.width - 50,
                        y: 10 // align to title
                    };
                },
                borderWidth: 0,
                backgroundColor: 'none',
                pointFormat: '{point.y}',
                headerFormat: '',
                shadow: false,
                style: {
                    fontSize: '18px'
                },
                valueDecimals: dataset.valueDecimals
            },
            series: [{
                data: dataset.history.data,
                name: dataset.id,
                type: "line",
                color: Highcharts.getOptions().colors[1],
                fillOpacity: 0.3,
                tooltip: {
                    valuePrefix: '$',//dataset.unit
                    valueSuffix: '/MWh'
                }
            }]
        })
    }
});


var seriesOptions = [],
    seriesCounter = 0,
    names = [0,1,2,3,4,5,6];

function createChart() {

    Highcharts.chart('generation', {
        title: {
            text: 'Generation (MW)',
            align: 'left',
            margin: 0,
            x: 30
        },
        chart: {
            type: 'area',
            marginLeft: 50, // Keep all charts left aligned
            spacingTop: 10,
            spacingRight: 40,
            spacingBottom: 40

        },
        // rangeSelector: {
            // selected: 4
        // },
        legend: {
            enabled: false,
        },
        xAxis: {
                type: 'datetime',
                crosshair: true,
                events: {
                    setExtremes: syncExtremes
                },
                labels: {
                    enabled: false,
                    // format: '{value}'
                }
            },
        yAxis: {
            startOnTick: false,
            endOnTick: false,
            max: 9500,
            min:-1000,
            offset: -20,
            labels: {
                formatter: function () {
                    return (this.value > 0 ? ' ' : ' ') + this.value + 'MW';
                }
            },
            plotLines: [{
                value: 0,
                width: 2,
                // color: 'silver'
            }]
        },
        plotOptions: {
            area: {
                stacking: 'normal',
            }
        },
        tooltip: {
            pointFormat: '',//'<span style="color:{series.color}">{series.name}</span>: <b>{point.y} {series.color}</b> (MW)<br/>',
            valueDecimals: 2,
            split: true,
            // style: {"color": "#333333", "cursor": "default", "fontSize": "10px", "pointerEvents": "none", "whiteSpace": "nowrap"}
        },

        series: seriesOptions

    });
}


Highcharts.ajax({
    url: 'springfield.json',
    dataType: 'text',
    success: function (datasets) {
        datasets = JSON.parse(datasets);
        for (i = 0; i < 7; i++) {
            
            dataset = datasets[i];
            sample = dataset.history.data.filter((_,i) => i % 6 == 0); // get every 6th

            if (i == 6 || i == 4) {
                for(var j=0; j<sample.length; j++) {
                    sample[j] *= -1;
                }
            }
            seriesOptions[i] = {
                name: dataset.fuel_tech,
                data: sample,
                pointStart: dataset.history.start*1000,
                pointInterval: 1000*60*30,
                stacking: 'normal'
            };
            // As we're loading the data asynchronously, we don't know what order it
            // will arrive. So we keep a counter and create the chart when all the data is loaded.
            seriesCounter += 1;
            if (seriesCounter === names.length) {
                createChart();
            }
        }
    }
});


var pieDiv = document.getElementById('piecharthere');
pieChart = new Highcharts.Chart(pieDiv,{
            chart: {
                // renderTo: 'container',
                type: 'pie'
            },
            title: {
              verticalAlign: 'middle',
              floating: true,
              text: ''
              },
            yAxis: {
                title: {
                    text: null
                }
            },
            plotOptions: {
                pie: {
                    shadow: false
                }
            },
            tooltip: {
                formatter: function() {
                    return '<b>'+ this.point.name +'</b>: '+ this.y +' MW';
                }
            },
            legend: {
                enabled: false
            },

            series: [{
                animation: false,
                name: '',
                data: [],
                size: '100%',
                innerSize: '50%',
                showInLegend:true,
                dataLabels: {
                    enabled: false
                }
            }]
        });

var barDiv = document.getElementById('barcharthere');
barChart = new Highcharts.Chart(barDiv,{
            chart: {
                // renderTo: 'container',
                type: 'bar'
            },
            title: {
                text: null,
                enabled: false
            },
            xAxis: {
                categories: ['Coal', 'Distillate', 'Gas', 'Hydro', 'Wind'],
            },
            tooltip: {
                enabled: false
            },
            legend: {
                enabled: false
            },

            series: [{
                animation: false,
                name: '',
                data: [],
                showInLegend:true,
                dataLabels: {
                    enabled: true
                }
            }]
        });


function updateLegend(x_idx) { // also updates bar/pie

    var srcPower = 0;
    for (i = 0; i < 7; i++) { // calculate net power
        if (i == 4 || i == 6) {
            continue;
        }
        data = seriesOptions[i];

        srcPower = srcPower + data.data[x_idx];
    }

    if (!(isNaN(price.history.data[x_idx]))) {
        document.getElementById('avgPrice').innerHTML = '$' + price.history.data[x_idx];
    }
    else {
        document.getElementById('avgPrice').innerHTML = '-';
    }

    if (!(isNaN(srcPower))) {
        document.getElementById('totalPower').innerHTML = srcPower.toFixed(2);
        }
    else {
        document.getElementById('totalPower').innerHTML = '-';
    }

    var windPower = seriesOptions[5].data[x_idx];
    if (!(isNaN(windPower))) {
        document.getElementById('windPower').innerHTML = windPower.toFixed(2);
        }
    else {
        document.getElementById('windPower').innerHTML = '-';
    }

    var windContr = windPower / srcPower;
    if (!(isNaN(windPower))) {
        document.getElementById('windContr').innerHTML = (100*windContr).toFixed(2) + '%';
        }
    else {
        document.getElementById('windContr').innerHTML = '-';
    }

    var hydroPower = seriesOptions[3].data[x_idx];
    if (!(isNaN(hydroPower))) {
        document.getElementById('hydroPower').innerHTML = hydroPower.toFixed(2);
        }
    else {
        document.getElementById('hydroPower').innerHTML = '-';
    }

    var hydroContr = hydroPower / srcPower;
    if (!(isNaN(windPower))) {
        document.getElementById('hydroContr').innerHTML = (100*hydroContr).toFixed(2) + '%';
        }
    else {
        document.getElementById('hydroContr').innerHTML = '-';
    }

    var gasPower = seriesOptions[2].data[x_idx];
    if (!(isNaN(gasPower))) {
        document.getElementById('gasPower').innerHTML = gasPower.toFixed(2);
        }
    else {
        document.getElementById('gasPower').innerHTML = '-';
    }

    var gasContr = gasPower / srcPower;
    if (!(isNaN(gasPower))) {
        document.getElementById('gasContr').innerHTML = (100*gasContr).toFixed(2) + '%';
        }
    else {
        document.getElementById('gasContr').innerHTML = '-';
    }

    var distPower = seriesOptions[1].data[x_idx];
    if (!(isNaN(distPower))) {
        document.getElementById('distPower').innerHTML = distPower.toFixed(2);
        }
    else {
        document.getElementById('distPower').innerHTML = '-';
    }

    var distContr = distPower / srcPower;
    if (!(isNaN(distPower))) {
        document.getElementById('distContr').innerHTML = (100*distContr).toFixed(2) + '%';
        }
    else {
        document.getElementById('distContr').innerHTML = '-';
    }

    var coalPower = seriesOptions[0].data[x_idx];
    if (!(isNaN(coalPower))) {
        document.getElementById('coalPower').innerHTML = coalPower.toFixed(2);
        }
    else {
        document.getElementById('coalPower').innerHTML = '-';
    }

    var coalContr = coalPower / srcPower;
    if (!(isNaN(coalPower))) {
        document.getElementById('coalContr').innerHTML = (coalContr*100).toFixed(2) + '%';
        }
    else {
        document.getElementById('coalContr').innerHTML = '-';
    }

    var exportPower = seriesOptions[6].data[x_idx];
    if (!(isNaN(exportPower))) {
        document.getElementById('exportPower').innerHTML = exportPower.toFixed(2);
        }
    else {
        document.getElementById('exportPower').innerHTML = '-';
    }

    var exportContr = exportPower / srcPower;
    if (!(isNaN(exportPower))) {
        document.getElementById('exportContr').innerHTML = (exportContr*100).toFixed(2) + '%';
        }
    else {
        document.getElementById('exportContr').innerHTML = '-';
    }    

    var pumpPower = seriesOptions[4].data[x_idx];
    if (!(isNaN(pumpPower))) {
        document.getElementById('pumpPower').innerHTML = pumpPower.toFixed(2);
        }
    else {
        document.getElementById('pumpPower').innerHTML = '-';
    }

    var pumpContr = pumpPower / srcPower;
    if (!(isNaN(pumpPower))) {
        document.getElementById('pumpContr').innerHTML = (pumpContr*100).toFixed(2) + '%';
        }
    else {
        document.getElementById('pumpContr').innerHTML = '-';
    }    
    var netPower = 0;
    for (i = 0; i < 7; i++) { // calculate net power
        data = seriesOptions[i];
        netPower = netPower + data.data[x_idx];
    }

    if (!(isNaN(netPower))) {
        document.getElementById('netPower').innerHTML = (netPower).toFixed(2);
        }
    else {
        document.getElementById('netPower').innerHTML = '-';
    }

    var loadsPower = 0;
    for (i = 0; i < 7; i++) { // calculate net power
        if (i == 4 || i == 6) {
            data = seriesOptions[i];
            loadsPower = loadsPower + data.data[x_idx];
        }
    }

    if (!(isNaN(loadsPower))) {
        document.getElementById('loadsPower').innerHTML = (loadsPower).toFixed(2);
        }
    else {
        document.getElementById('loadsPower').innerHTML = '-';
    }

    var renewContr = (windContr + hydroContr);

    if (!(isNaN(renewContr))) {
        document.getElementById('renewablesContr').innerHTML = (renewContr*100).toFixed(2) + '%';
        }
    else {
        document.getElementById('renewablesContr').innerHTML = '-';
    }

    pieData = [['Coal', coalPower], ['Distillate', distPower], ['Gas', gasPower], ['Hydro', hydroPower], ['Pumps', []], ['Wind', windPower],   ['Export', []]];
    pieChart.series[0].update({
        data: pieData
    });
    if (!(isNaN(srcPower))) {
        pieChart.update({
                title: {
                      verticalAlign: 'middle',
                      floating: true,
                      text: srcPower.toFixed(2) + ' MW'
                      }
            });
    }
    barData = [{y: coalPower, color: '#7cb5ec'}, {y: distPower, color: '#434348'}, {y: gasPower, color: '#90ed7d'}, {y: hydroPower, color: '#f7a35c'}, {y: windPower, color: '#f15c80'}];

    barChart.series[0].update({
        data: barData
    });
    
}
