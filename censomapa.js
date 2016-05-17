app = {
    map: null,

    init: function () {
        this.map = L.map('map_container')
            .setView(new L.LatLng(-38, -56), 4)
            .addLayer(this.createOSM());
        this.loadProvincias();
    },

    createOSM: function () {
        return new L.tileLayer('http://{s}tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
            maxZoom: 12,
            subdomains: ['a.', 'b.', 'c.', '']
        });
    },

    loadProvincias: function () {
        _this = this;
        $.getJSON('provincias.json', function(geoJsonData){
            L.geoJson(geoJsonData).addTo(_this.map);
        })
    }
};

app.init();

var featureExtents = function (feature) {
    var b = feature.data.properties.bounds;
    return [{lon: b[0], lat: b[1]}, {lon: b[2], lat: b[3]}];
};

var loadProvincia = function (feature, layer) {
    //jQuery.data(feature.element, 'originalClass', 'color' + ((i % 5) + 1));
    //feature.element.setAttribute('class', 'color' + ((i % 5) + 1));
    //
    var name = feature.properties.provincia;
    jQuery.data($("#menu li a:contains('" + name.toUpperCase() + "')")[0], 'feature', feature);
};

var loadDepartamentos = function (e) {
    for (var i = 0; i < e.features.length; i++) {
        var feature = e.features[i];
        feature.element.setAttribute('class', 'dpto');
    }
};



//.container(document.getElementById("map").appendChild(po.svg("svg")))
//.center({lat: -38, lon: -56})
//.zoomRange([3, 12])
//.zoom(4)
//.add(po.interact());


//map.add(po.image()
//	.url(po.url("http://{S}tile.cloudmade.com"
//		    + "/1a1b06b230af4efdbb989ea99e9841af" // http://cloudmade.com/register
//		    + "/20760/256/{Z}/{X}/{Y}.png")
//	     .hosts(["a.", "b.", "c.", ""])));


//var provincias = map.add(po.geoJson()
//			 .url("provincias.json")
//			 .tile(false).on('load', loadProvincias));

//map.add(po.compass()
//	.pan("none"));


/*$(document).ready(function () {
    $('#menu li a').mouseover(function (e) {
            var f = jQuery.data($(this)[0], 'feature').element;
            f.setAttribute('class', 'provinciaFoco');
        })
        .mouseout(function (e) {
            var f = jQuery.data($(this)[0], 'feature').element;
            f.setAttribute('class', jQuery.data(f, 'originalClass'));
        })
        .click(function (e) {
            var f = jQuery.data($(this)[0], 'feature');
            map.extent(featureExtents(f));
            // get json para los departamentos
            map.add(po.geoJson()
                .url("provincias/" + f.data.properties.provincia.toUpperCase() + ".json")
                .tile(false)
                .on('load', loadDepartamentos));

        });

});*/






