$(document).ready(function() {
    var options = {
        chart: {
            renderTo: 'container',
            type: 'line',
            zoomType: 'x'
        }, 
        title: {
            text: 'Data Visualization for Training and Competition Data of Powerlifting \
                        and Strongman from 2012 to 2014 - Isaak'
        },
        subtitle: {
            text: document.ontouchstart === undefined ?
                    'Click and drag in the plot area to zoom in' :
                    'Pinch the chart to zoom in'
        },
        xAxis: {
            type: 'datetime',
            minRange: 5 * 24 * 3600000 // 5 days
        }, 
        yAxis: {
            title: {
                text: 'Weight (pounds)'
            }
        },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle',
            borderWidth: 0
        },
        plotOptions: {
            area: {
                fillColor: {
                    linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1},
                    stops: [
                        [0, Highcharts.getOptions().colors[0]],
                        [0.5, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                    ]
                },
                marker: {
                    radius: 0.5
                },
                lineWidth: 0.5,
                states: {
                    hover: {
                        lineWidth: 0.5
                    }
                }, 
                threshold: null
            },
            series: {
                cursor: 'pointer',
                point: {
                    events: {
                        click: function () {
                            if(this.options.url != undefined) {
                                location.href = this.options.url;
                            }  
                        }
                    }
                }
            }
        },
        tooltip: {
            pointFormat: '<span style="color:{series.color}">\u25CF</span> {series.name}: <b>{point.y}</b><br/>',
            crosshairs: true,
            shared: true
        }, 
        series: []
    };

    $.get('data/Isaak.csv', function(data) {
        // split the lines
        var lines = data.split('\n');
        //console.log(lines);
        var actions = [];
        var bench = {
            data: [],

        }
        var squat = {
            data: []
        }
        var deadlift = {
            data: []
        }
        $.each(lines, function(lineNo, line) {
            var items = line.split(',');

            // header line contains categories
            var currDate = null;
            if(lineNo == 0) {
                $.each(items, function(itemNo, item) {
                    item = item.replace(/"/g, ""); 
                    if(itemNo > 0) actions.push(item);
                });
                //console.log(actions);

            } else {
                $.each(items, function(itemNo, item) {
                    if(itemNo == 0) {
                        item = item.replace(/"/g, "");
                      
                        var dateString = item.split('-');
                        var year = parseInt(dateString[2]); // 2012-2014
                        var month = parseInt(dateString[0]) - 1; // months: 0-based index
                        var day = parseInt(dateString[1]);
                        currDate = Date.UTC(year, month, day);
                        
                    } else {
                        if(itemNo == 2) {
                            if(bench.name == null) {
                                bench.name = actions[1];
                            } 
                            if(item != "x") {
                                bench.data.push( [currDate, parseFloat(item)] );
                            }
                                 
                        } else if (itemNo == 1) {
                            if(squat.name == null) {
                                squat.name = actions[0];
                            }
                            if(item != "x") {
                                squat.data.push( [currDate, parseFloat(item)] );
                            }

                        } else {
                            if(deadlift.name == null) {
                                deadlift.name = actions[2];
                            }
                            if(item != "x") {
                                deadlift.data.push( [currDate, parseFloat(item)] );
                            }
                        } 
                    }
                });
            }
        }); 

        options.series.push(bench);
        options.series.push(squat);
        options.series.push(deadlift);
        var chart = new Highcharts.Chart(options);
    });

    
});