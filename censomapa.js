app = {
    map: null,
    geojson: null,


    init: function () {
        this.map = L.map('map_container')
            .setView(new L.LatLng(-38, -56), 4)
            .addLayer(this.createOSM());
        this.loadAllProvincias();
    },


    createOSM: function () {
        return new L.tileLayer('http://{s}tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
            maxZoom: 12,
            subdomains: ['a.', 'b.', 'c.', '']
        });
    },


    loadAllProvincias: function () {
        var _this = this;
        $.getJSON('provincias.json', function(geoJsonData){
            _this.geojson = L.geoJson(geoJsonData, {
                onEachFeature: app.loadProvincia,
                style: app.getStyle
            }).addTo(_this.map);
        })
    },


    loadProvincia: function (feature, layer) {
        layer.on({
            mouseover: app.highlightFeature,
            mouseout: app.resetHighlight,
            click: app.zoomToFeature
        });

        app.setMenuLink(feature.properties.provincia, layer);
    },

    getColor: function (id) {
    switch ( id % 5) {
        case 0: return '#D7191C';
        case 1: return '#FDAE61';
        case 2: return '#FFFFBF';
        case 3: return '#ABD9E9';
        case 4: return '#C7BB62';
    }
},

    getStyle: function (feature) {
        return {
            fillColor: app.getColor(feature.properties.objectid),
            fillOpacity: 0.7,
            color: 'white',
            weight: 1.5,
            opacity: 0.8,
            dashArray: '3'
        };
    },


    highlightFeature: function (e) {
        var layer = e.target.feature ? e.target: $(this).data('layer');

        layer.setStyle({
            weight: 5,
            color: '#666',
            dashArray: '',
            fillOpacity: 0.7
        });
        if (!L.Browser.ie && !L.Browser.opera) {
            layer.bringToFront();
        }
    },

    resetHighlight: function (e) {
        var layer = e.target.feature ? e.target: $(this).data('layer');
        //var layer = e.target;
        app.geojson.resetStyle(layer);
    },

    zoomToFeature: function (e) {
        var layer = e.target.feature ? e.target: $(this).data('layer');
        app.map.fitBounds(layer.getBounds());
        app.loadDepartamentos(layer.feature)
    },



    loadDepartamentos: function (feature) {
        var _this = this;
        $.getJSON('provincias/'+ feature.properties.provincia.toUpperCase() +'.json', function(geoJsonData){
            L.geoJson(geoJsonData).addTo(_this.map);
        })
    },

    setMenuLink: function (name, layer) {
        $.data($("#menu li a:contains('" + name.toUpperCase() + "')")[0], 'layer', layer);
    }
};


$(document).ready(function () {

    app.init();

    $('#menu li a')
        .mouseover( app.highlightFeature)
        .mouseout( app.resetHighlight )
        .click( app.zoomToFeature );
});






