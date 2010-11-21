// Namespace
var WGS1984_CH1903 = WGS1984_CH1903 || {};

// Version of this library
WGS1984_CH1903.VERSION = "0.0.1";

// Nondestructive namespacing function, if a namespace exists, it won't be 
// re-created.
WGS1984_CH1903.namespace = function (ns_string) {
    var parts = ns_string.split('.'),
        parent = WGS1984_CH1903,
        i;
    
    // Strip redoundant leading global
    if (parts[0] === "WGS1984_CH1903") {
        parts = parts.slice(1);
    }
    
    for (i = 0; i < parts.length; i += 1) {
        // Create a property if it doesn't exist
        if (typeof parent[parts[i]] === "undefined") {
            parent[parts[i]] = {};
        }
        parent = parent[parts[i]];
    }
    return parent;
};

// Convert WGS lat/long (° dec) to CH y
WGS1984_CH1903.WGStoCHy = function (lat, lng) {
    var utilities = WGS1984_CH1903.namespace('WGS1984_CH1903.utilities'), 
        lat_aux, lng_aux;
    // Converts degrees dec to sex
    lat = utilities.DECtoSEX(lat);
    lng = utilities.DECtoSEX(lng);
    
    // Converts degrees to seconds (sex)
    lat = utilities.DEGtoSEC(lat);
    lng = utilities.DEGtoSEC(lng);
    
    // Axiliary values (% Bern)
    lat_aux = (lat - 169028.66) / 10000;
    lng_aux = (lng - 26782.5) / 10000;
    
    // Process Y
    return 600072.37 + 211455.93 * lng_aux - 10938.51 * lng_aux * lat_aux - 
        0.36 * lng_aux * Math.pow(lat_aux, 2) - 44.54 * Math.pow(lng_aux, 3);
};

// Convert WGS lat/long (° dec) to CH x
WGS1984_CH1903.WGStoCHx = function (lat, lng) {
    var utilities = WGS1984_CH1903.namespace('WGS1984_CH1903.utilities'), 
        lat_aux, lng_aux;
    // Converts degrees dec to sex
    lat = utilities.DECtoSEX(lat);
    lng = utilities.DECtoSEX(lng);
    
    // Converts degrees to seconds (sex)
    lat = utilities.DEGtoSEC(lat);
    lng = utilities.DEGtoSEC(lng);
    
    // Axiliary values (% Bern)
    lat_aux = (lat - 169028.66) / 10000;
    lng_aux = (lng - 26782.5) / 10000;
    
    // Process X
    return 200147.07 + 308807.95 * lat_aux + 3745.25 * Math.pow(lng_aux, 2) + 
        76.63 * Math.pow(lat_aux, 2) - 194.56 * Math.pow(lng_aux, 2) * 
        lat_aux + 119.79 * Math.pow(lat_aux, 3);
};

// Convert CH y/x to WGS lat
WGS1984_CH1903.CHtoWGSlat = function (y, x) {
    var y_aux, x_aux, lat;
    // Converts militar to civil and  to unit = 1000km
    // Axiliary values (% Bern)
    y_aux = (y - 600000) / 1000000;
    x_aux = (x - 200000) / 1000000;
    
    // Process lat
    lat = 16.9023892 + 3.238272 * x_aux - 0.270978 * Math.pow(y_aux, 2) - 
        0.002528 * Math.pow(x_aux, 2) - 0.0447 * Math.pow(y_aux, 2) * x_aux - 
        0.0140 * Math.pow(x_aux, 3);
    
    // Unit 10000" to 1 " and converts seconds to degrees (dec)
    return lat * 100 / 36;
};

// Convert CH y/x to WGS long
WGS1984_CH1903.CHtoWGSlng = function (y, x) {
    var y_aux, x_aux, lng;
    // Converts militar to civil and  to unit = 1000km
    // Axiliary values (% Bern)
    y_aux = (y - 600000) / 1000000;
    x_aux = (x - 200000) / 1000000;
    
    // Process long
    lng = 2.6779094 + 4.728982 * y_aux + 0.791484 * y_aux * x_aux + 0.1306 * 
        y_aux * Math.pow(x_aux, 2) - 0.0436 * Math.pow(y_aux, 3);
    
    // Unit 10000" to 1 " and converts seconds to degrees (dec)
    return lng * 100 / 36;
};

WGS1984_CH1903.namespace('WGS1984_CH1903.utilities');

WGS1984_CH1903.utilities = (function () {
        // Dependencies
    //var 
        
        // Private properties
        
        // Private methods
        
        // end var
    
    // Optionally ont-time init procedures
    
    // public API
    return {
        // Convert SEX DMS angle to DEC
        SEXtoDEC: function (angle) {
            var deg, min, sec;
            // Extract DMS
            deg = parseInt(angle, 10);
            min = parseInt((angle - deg) * 100, 10);
            sec = (((angle - deg) * 100) - min) * 100;
            
            // Result in degrees sex (dd.mmss)
            return deg + (sec / 60 + min) / 60;
        },
        
        // Convert DEC angle to SEX DMS
        DECtoSEX: function (angle) {
            var deg, min, sec;
            // Extract DMS
            deg = parseInt(angle, 10);
            min = parseInt((angle - deg) * 60, 10);
            sec = (((angle - deg) * 60) - min) * 60;
            
            // Result in degrees sex (dd.mmss)
            return deg + min / 100 + sec / 10000;
        },
        
        // Convert Degrees angle to seconds
        DEGtoSEC: function (angle) {
            var deg, min, sec;
            // Extract DMS
            deg = parseInt(angle, 10);
            min = parseInt((angle - deg) * 100, 10);
            sec = (((angle - deg) * 100) - min) * 100;
            
            // Result in degrees sex (dd.mmss)
            return sec + min * 60 + deg * 3600;
        }
    };
}());