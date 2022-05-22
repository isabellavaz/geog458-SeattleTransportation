function parseCSV(createGraph) {
    Papa.parse("../assets/seattlegasprices.csv", {
        download: true,
        complete: function(results) {
            createGraph(results.data);
        }
    })
}

function createGraph(data) {
    var months = [];
    var gasPrices = ["Average Gas Price"];

    for (var i = data.length - 1; i > 0; i--) {
        months.push(data[i][0]);
        gasPrices.push(data[i][1]);
    }
    console.log(months);
    console.log(gasPrices);
    var chart = c3.generate({
        bindto: '#chart',
        data: {
            columns: [gasPrices]
        },
        axis: {
            x: {
                type: 'category',
                categories: months,
                tick: {
	            	multiline: false,
                	culling: {
                    	max: 12
                	}
                }
            }
        },
	    zoom: {
        	enabled: true
    	},
	    legend: {
	        position: 'right'
	    }
    });
}

parseCSV(createGraph);