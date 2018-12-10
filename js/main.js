$(document).ready(function() {

    $.ajax({
        dataType: "text",
        url: "Disagg.json",
        success: function(response) {
            let lines = response.split('\n');
            createDataTable(lines);
            createDefaultHighChart();
        },
        error: function(response, status, error) {
            console.log('Error:', status, error);
        }
    });

    let createDataTable = (lines) => {
        let jsonArray = [];
        let allData = [];
        lines.forEach((line)=>{
            if(line) {
                let jsonLine = JSON.parse(line);
                allData.push(jsonLine);
                if(!jsonArray.includes(jsonLine.Meter_ID)) {
                    jsonArray.push(jsonLine.Meter_ID);
                }
            }
        });

        $('#meter-table').DataTable({
            data: jsonArray.map(d => [d])
        });

        $('#meter-table tbody').on( 'click', 'tr', function (event) {
            let table = $('#meter-table').DataTable();
            if ( $(this).hasClass('selected') ) {
                $(this).removeClass('selected');
            }
            else {
                table.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
            }
            let meterIdSelected = event.target.innerHTML;
            let meterData = allData.filter((line)=> line.Meter_ID === meterIdSelected);
            createMeterChart(meterData);
        } );
    };

    let createMeterChart = (meterData) => {
        let baseLoad = meterData.filter((line)=> line.Type === 'BaseLoad');
        let WSL = meterData.filter((line)=> line.Type === 'WSL');
        let TSL = meterData.filter((line)=> line.Type === 'TSL');

        let baseLoadData = [];
        let wslData = [];
        let tslData = [];

        baseLoad.forEach(dataSet => {
            let splitDates = dataSet.Date.split('-');
            baseLoadData.push([
                Date.UTC(splitDates[0], splitDates[1], splitDates[2]), dataSet[1]
            ]);
        });

        WSL.forEach(dataSet => {
            let splitDates = dataSet.Date.split('-');
            wslData.push([
                Date.UTC(splitDates[0], splitDates[1], splitDates[2]), dataSet[1]
            ]);
        });

        TSL.forEach(dataSet => {
            let splitDates = dataSet.Date.split('-');
            tslData.push([
                Date.UTC(splitDates[0], splitDates[1], splitDates[2]), dataSet[1]
            ]);
        });

        Highcharts.chart('chart-holder', {
            chart: {
                type: 'spline'
            },
            title: {
                text: 'Meters For Dates'
            },
            subtitle: {
                text: 'Disagg.json'
            },
            rangeSelector:{
                enabled: true
            },
            xAxis: {
                type: 'datetime',
                dateTimeLabelFormats: {
                    month: '%e. %b',
                    year: '%b'
                },
                title: {
                    text: 'Date'
                }
            },
            yAxis: {
                title: {
                    text: 'Meters'
                },
                min: 0
            },
            tooltip: {
                headerFormat: '<b>{series.name}</b><br>',
                pointFormat: '{point.x:%e. %b}: {point.y:.2f} m'
            },

            plotOptions: {
                spline: {
                    marker: {
                        enabled: true
                    }
                }
            },

            colors: ['#6CF', '#39F', '#06C', '#036', '#000'],

            series: [{
                name: "Baseload",
                data: baseLoadData
            }, {
                name: "WSL",
                data: wslData
            }, {
                name: "TSL",
                data: tslData
            }]
        });
    };

    let createDefaultHighChart = () => {
        Highcharts.chart('chart-holder', {
            chart: {
                type: 'spline'
            },
            title: {
                text: 'Meters For Dates'
            },
            subtitle: {
                text: 'Disagg.json'
            },
            rangeSelector:{
                enabled: true
            },
            xAxis: {
                type: 'datetime',
                dateTimeLabelFormats: {
                    month: '%e. %b',
                    year: '%b'
                },
                title: {
                    text: 'Date'
                }
            },
            yAxis: {
                title: {
                    text: 'Meters'
                },
                min: 0
            },
            tooltip: {
                headerFormat: '<b>{series.name}</b><br>',
                pointFormat: '{point.x:%e. %b}: {point.y:.2f} m'
            },

            plotOptions: {
                spline: {
                    marker: {
                        enabled: true
                    }
                }
            },

            colors: ['#6CF', '#39F', '#06C', '#036', '#000'],

            series: [{
                name: "Baseload"
            }, {
                name: "WSL"
            }, {
                name: "TSL"
            }]
        });
    }
});