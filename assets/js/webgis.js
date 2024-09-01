// --- Map initiation ---
var map = L.map("map", {
  center: [-7.4552, 107.1342],
  zoomControl: false,
}).setView([-7.4552, 107.1342], 11);

// --- BaseMap & Layer ----
// OSM Layer
var OSM = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
});

// Esri Layer
var EsriImagery = L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
  attribution: '&copy; <a href="https://www.esri.com/en-us/arcgis/products/arcgis-platform/services/basemaps">ESRI</a>',
});

// GoogleStreet Layer
var googleStreets = L.tileLayer("http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}", {
  maxZoom: 20,
  subdomains: ["mt0", "mt1", "mt2", "mt3"],
  attribution: '&copy; <a href="https://www.google.com/intl/id/maps/about/#!/">Google Maps</a>',
});

//Google Hybrid
var googleHybrid = L.tileLayer("http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}", {
  maxZoom: 20,
  subdomains: ["mt0", "mt1", "mt2", "mt3"],
  attribution: '&copy; <a href="https://www.google.com/intl/id/maps/about/#!/">Google Maps</a>',
}).addTo(map);

//Basemap Layer Control
var baseMaps = {
  OSM: OSM,
  "Esri Imagery": EsriImagery,
  "Google Streets": googleStreets,
  "Google Hybrid": googleHybrid,
};

// --- Search box locations ----
L.Control.geocoder({
  position: "topleft",
  string: {
    title: "Pencarian lokasi",
  },
}).addTo(map);

// custsom
document.addEventListener("DOMContentLoaded", function () {
  var button = document.querySelector(".leaflet-control-geocoder-icon");
  if (button) {
    button.setAttribute("title", "Pencarian lokasi");
  }

  var input = document.querySelector(".leaflet-control-geocoder-form input");
  if (input) {
    input.setAttribute("placeholder", "Temukan alamat atau tempat");
  }
});

// --- Current Location ----
L.control
  .locate({
    flyTo: true,
    locateOptions: {
      enableHighAccuracy: true,
    },
    strings: {
      title: "Lokasi Anda saat ini",
      popup: "You are within {distance} {unit} from this point",
      outsideMapBoundsMsg: "You seem located outside the boundaries of the map",
    },
  })
  .addTo(map);

//
var zoom_bar = new L.Control.ZoomBar({ position: "topleft" }).addTo(map);

// -- Coordinates
L.control
  .coordinates({
    position: "bottomleft",
    decimals: 3,
    decimalSeperator: ".",
    labelTemplateLat: "{y}",
    labelTemplateLng: "Posisi Mouse : {x},",
  })
  .addTo(map);

// --- Scalebar ---
L.control
  .scale({
    metric: true,
    imperial: true,
    maxwidth: 100,
    position: "bottomleft",
  })
  .addTo(map);

var legend = L.control
  .Legend({
    position: "bottomright",
    title: "Legenda",
    collapsed: true,
    symbolWidth: 24,
    opacity: 1,
    column: 2,
    legends: [
      {
        label: "Shelter Evakuasi",
        type: "circle",
        radius: 5,
        fillColor: "#76ff00",
        color: "#76ff00",
        weight: 2,
        opacity: 1,
        fillOpacity: 0.8,
      },
      {
        label: "Titik Bahaya",
        type: "circle",
        radius: 5,
        fillColor: "#ff0000",
        color: "#b2b2b2",
        weight: 2,
        opacity: 1,
        fillOpacity: 0.8,
      },
      {
        label: "Jalur Evakuasi",
        type: "polyline",
        color: "blue",
        fillColor: "blue",
        weight: 2,
      },
      {
        label: "Batas Desa",
        type: "polyline",
        fillOpacity: 0,
        color: "#ffcc00",
        dashArray: [5, 5],
        weight: 2,
      },
      {
        label: "Batas Kecamatan",
        type: "polyline",
        fillOpacity: 0,
        color: "black",
        weight: 2,
      },
      {
        label: "Pemukiman",
        type: "rectangle",
        color: "#ffa6b8",
        fillColor: "#ffa6b8",
        weight: 2,
      },
      {
        label: "Bahaya Tsunami dan Inundasi",
        type: "rectangle",
        color: "#ffffff",
        fillColor: "#ffffff",
        weight: 2,
      },
      {
        label: "Rendah",
        type: "rectangle",
        color: "#169936",
        fillColor: "#169936",
        weight: 2,
      },
      {
        label: "Sedang",
        type: "rectangle",
        color: "#fff701",
        fillColor: "#fff701",
        weight: 2,
      },
      {
        label: "Tinggi",
        type: "rectangle",
        color: "#ff2701",
        fillColor: "#ff2701",
        weight: 2,
      },
    ],
  })
  .addTo(map);

// --- Map ---
// Point Shelter Evakuasi
var customIcon = {
  radius: 5,
  fillColor: "#76ff00",
  color: "#76ff00",
  weight: 2,
  opacity: 1,
  fillOpacity: 0.8,
};

var hoverIcon = {
  radius: 5,
  fillColor: "#48ff00",
  color: "#ffffff",
  weight: 2,
  opacity: 1,
  fillOpacity: 0.8,
};

var markers = L.markerClusterGroup();

var geoJsonLayer = L.geoJSON(shelterEvakuasi, {
  pointToLayer: function (feature, latlng) {
    var marker = L.circleMarker(latlng, customIcon);
    var popupContent = `
    <div style="text-align: left;">
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <th style="border: 1px solid black; padding: 3px;">Shelter</th>
          <td style="border: 1px solid black; padding: 3px; white-space: nowrap;">${feature.properties.NAMOBJ}</td>
        </tr>
        <tr>
          <th style="border: 1px solid black; padding: 3px;">Desa</th>
          <td style="border: 1px solid black; padding: 3px;">${feature.properties.Desa}</td>
        </tr>
        <tr>
          <th style="border: 1px solid black; padding: 3px;">Kecamatan</th>
          <td style="border: 1px solid black; padding: 3px;">${feature.properties.Kecamatan}</td>
        </tr>
        <tr>
          <th style="border: 1px solid black; padding: 3px;">Kapasitas</th>
          <td style="border: 1px solid black; padding: 3px;">${feature.properties.Kapasitas} orang</td>
        </tr>
        <tr>
          <td colspan="2" style="border: 1px solid black; padding: 3px; text-align: center;">
          <img src="${feature.properties.Gambar}" alt="Shelter Image" style="width: 100%; height: auto;">
          </td>
        </tr>
      </table>
    </div>`;
    marker.bindPopup(popupContent);

    // Tambahkan event listener untuk mouseover dan mouseout
    marker.on("mouseover", function (e) {
      this.setStyle(hoverIcon);
    });

    marker.on("mouseout", function (e) {
      this.setStyle(customIcon);
    });
    return marker;
  },
});

markers.addLayer(geoJsonLayer);
map.addLayer(markers);

// Point Titik Bahaya
var customIconTB = {
  radius: 5,
  fillColor: "#ff0000",
  color: "#b2b2b2",
  weight: 2,
  opacity: 1,
  fillOpacity: 0.8,
};

var hoverIconTB = {
  radius: 5,
  fillColor: "#faff00",
  color: "#faff00",
  weight: 2,
  opacity: 1,
  fillOpacity: 0.8,
};

var markersTB = L.geoJSON(titikBahaya, {
  pointToLayer: function (feature, latlng) {
    var markerTB = L.circleMarker(latlng, customIconTB);
    var popupContent = `
    <div style="text-align: left;">
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <th >TB</th>
          <td style="white-space: nowrap; padding-left: 5px">: ${feature.properties.NAMOBJ}</td>
        </tr>
        <tr>
          <th>Desa</th>
          <td style="white-space: nowrap; padding-left: 5px">: ${feature.properties.Desa}</td>
        </tr>
        <tr>
          <th>Kecamatan</th>
          <td style="white-space: nowrap; padding-left: 5px">: ${feature.properties.Kecamatan}</td>
        </tr>
      </table>
    </div>`;
    markerTB.bindPopup(popupContent);

    // Tambahkan event listener untuk mouseover dan mouseout
    markerTB.on("mouseover", function (e) {
      this.setStyle(hoverIconTB);
    });

    markerTB.on("mouseout", function (e) {
      this.setStyle(customIconTB);
    });
    return markerTB;
  },
});

// Line Jalur Evakuasi
var styleJalurEvakuasi = {
  color: "blue",
  weight: 2,
  opacity: 1,
};

var hoverJalurEvakuasi = {
  color: "red",
  weight: 6,
  opacity: 1,
};

var jalurEvakuasi = L.geoJSON(jalurEvakuasi, {
  style: styleJalurEvakuasi,
  onEachFeature: function (feature, layer) {
    // Membuat konten popup kustom
    var popupContent = `
    <div style="text-align: left;">
      <table style="width: 100%; white-space: nowrap;">
        <tr>
          <th style="font-weight: normal;"> <strong> Jalur </strong> : ${feature.properties.Name}</th>
        </tr>
        <tr>
          <th style="font-weight: normal;"> <strong> Panjang </strong> : ${feature.properties.m} m atau ${feature.properties.km} km</th>
        </tr>
        <tr>
          <th style="font-weight: normal;"> <strong> Waktu tempuh dgn berjalan </strong> : ${feature.properties.w_jalan} mnt</th>
        </tr>
        <tr>
          <th style="font-weight: normal;"> <strong> Waktu tempuh dgn berlari </strong> : ${feature.properties.w_lari} mnt</th>
        </tr>
      </table>
    </div>`;

    // Mengatur popup untuk setiap fitur
    layer.bindPopup(popupContent);

    // Tambahkan event listener untuk mouseover dan mouseout
    layer.on("mouseover", function () {
      this.setStyle(hoverJalurEvakuasi);
    });

    layer.on("mouseout", function () {
      this.setStyle(styleJalurEvakuasi);
    });
  },
});

// Polygon Batas Kecamatan
var adminKec = L.geoJSON(adminKec, {
  style: {
    fillOpacity: 0,
    color: "black",
    weight: 2,
  },
  onEachFeature: function (feature, layer) {
    // Membuat konten popup kustom
    var popupContent = "<div>" + "<strong>" + "Kecamatan " + feature.properties.WADMKC + "<strong>" + "</div>";

    // Mengatur popup untuk setiap fitur
    layer.bindPopup(popupContent);
  },
});

// Polygon Batas Desa
var adminDesa = L.geoJSON(adminDesa, {
  style: {
    fillOpacity: 0,
    color: "#ffcc00",
    dashArray: "10, 10",
    weight: 2,
  },
  onEachFeature: function (feature, layer) {
    // Membuat konten popup kustom
    var popupContent = "<div>" + "Desa " + feature.properties.NAMOBJ + "</div>" + "<div>" + "<strong>" + "Kecamatan " + feature.properties.WADMKC + "<strong>" + "</div>";

    // Mengatur popup untuk setiap fitur
    layer.bindPopup(popupContent);
  },
});

// Polygon Pemukiman
var pemukiman = L.geoJSON(pemukiman, {
  style: {
    fillColor: "#ffa6b8",
    color: "#ffa6b8",
    opacity: 1,
    fillOpacity: 0.7,
    weight: 0.1,
  },
});

// Polygon Bahaya Tsunami
var bahayaTsunami = L.geoJSON(bahayaTsunami, {
  style: function (feature) {
    // Memilih warna berdasarkan indeks fitur
    if (feature.properties.Kelas === "Tinggi") {
      return { fillColor: "#ff2701", color: "#ff2701", weight: 0.1, opacity: 1, fillOpacity: 0.5 };
    } else if (feature.properties.Kelas === "Sedang") {
      return { fillColor: "#fff701", color: "#fff701", weight: 0.1, opacity: 1, fillOpacity: 0.5 };
    } else if (feature.properties.Kelas === "Rendah") {
      return { fillColor: "#169936", color: "#169936", weight: 0.1, opacity: 1, fillOpacity: 0.5 };
    }
  },
  onEachFeature: function (feature, layer) {
    // Membuat konten popup kustom
    var popupContent = "<p>" + "<strong>Zona Bahaya : </strong>" + feature.properties.Kelas + "</p>";

    // Mengatur popup untuk setiap fitur
    layer.bindPopup(popupContent);
  },
});

// Polygon Inundasi Tsunami 5m
var inundasi5m = L.geoJSON(inundasi5m, {
  style: function (feature) {
    // Memilih warna berdasarkan indeks fitur
    if (feature.properties.Kelas === "Bahaya Tinggi") {
      return { fillColor: "#ff2701", color: "#ff2701", weight: 0.1, opacity: 1, fillOpacity: 0.5 };
    } else if (feature.properties.Kelas === "Bahaya Sedang") {
      return { fillColor: "#fff701", color: "#fff701", weight: 0.1, opacity: 1, fillOpacity: 0.5 };
    } else if (feature.properties.Kelas === "Bahaya Rendah") {
      return { fillColor: "#169936", color: "#169936", weight: 0.1, opacity: 1, fillOpacity: 0.5 };
    }
  },
  onEachFeature: function (feature, layer) {
    // Membuat konten popup kustom
    var popupContent = "<p>" + feature.properties.Kelas + "</p>";

    // Mengatur popup untuk setiap fitur
    layer.bindPopup(popupContent);
  },
});

// Polygon Inundasi Tsunami 10m
var inundasi10m = L.geoJSON(inundasi10m, {
  style: function (feature) {
    // Memilih warna berdasarkan indeks fitur
    if (feature.properties.Kelas === "Bahaya Tinggi") {
      return { fillColor: "#ff2701", color: "#ff2701", weight: 0.1, opacity: 1, fillOpacity: 0.5 };
    } else if (feature.properties.Kelas === "Bahaya Sedang") {
      return { fillColor: "#fff701", color: "#fff701", weight: 0.1, opacity: 1, fillOpacity: 0.5 };
    } else if (feature.properties.Kelas === "Bahaya Rendah") {
      return { fillColor: "#169936", color: "#169936", weight: 0.1, opacity: 1, fillOpacity: 0.5 };
    }
  },
  onEachFeature: function (feature, layer) {
    // Membuat konten popup kustom
    var popupContent = "<p>" + feature.properties.Kelas + "</p>";

    // Mengatur popup untuk setiap fitur
    layer.bindPopup(popupContent);
  },
});

// Polygon Inundasi Tsunami 15m
var inundasi15m = L.geoJSON(inundasi15m, {
  style: function (feature) {
    // Memilih warna berdasarkan indeks fitur
    if (feature.properties.Kelas === "Bahaya Tinggi") {
      return { fillColor: "#ff2701", color: "#ff2701", weight: 0.1, opacity: 1, fillOpacity: 0.5 };
    } else if (feature.properties.Kelas === "Bahaya Sedang") {
      return { fillColor: "#fff701", color: "#fff701", weight: 0.1, opacity: 1, fillOpacity: 0.5 };
    } else if (feature.properties.Kelas === "Bahaya Rendah") {
      return { fillColor: "#169936", color: "#169936", weight: 0.1, opacity: 1, fillOpacity: 0.5 };
    }
  },
  onEachFeature: function (feature, layer) {
    // Membuat konten popup kustom
    var popupContent = "<p>" + feature.properties.Kelas + "</p>";

    // Mengatur popup untuk setiap fitur
    layer.bindPopup(popupContent);
  },
});

// Polygon Inundasi Tsunami 20m
var inundasi20m = L.geoJSON(inundasi20m, {
  style: function (feature) {
    // Memilih warna berdasarkan indeks fitur
    if (feature.properties.Kelas === "Bahaya Tinggi") {
      return { fillColor: "#ff2701", color: "#ff2701", weight: 0.1, opacity: 1, fillOpacity: 0.5 };
    } else if (feature.properties.Kelas === "Bahaya Sedang") {
      return { fillColor: "#fff701", color: "#fff701", weight: 0.1, opacity: 1, fillOpacity: 0.5 };
    } else if (feature.properties.Kelas === "Bahaya Rendah") {
      return { fillColor: "#169936", color: "#169936", weight: 0.1, opacity: 1, fillOpacity: 0.5 };
    }
  },
  onEachFeature: function (feature, layer) {
    // Membuat konten popup kustom
    var popupContent = "<p>" + feature.properties.Kelas + "</p>";

    // Mengatur popup untuk setiap fitur
    layer.bindPopup(popupContent);
  },
});

// --- Layer Control ---
// Load data
var overlayLayers = {
  "Shelter Evakuasi": markers,
  "Titik Bahaya": markersTB,
  "Jalur Evakuasi": jalurEvakuasi,
  "Batas Desa": adminDesa,
  "Batas Kecamatan": adminKec,
  "Bahaya Tsunami": bahayaTsunami,
  "Area Pemukiman": pemukiman,
  "Inundasi 5 m": inundasi5m,
  "Inundasi 10 m": inundasi10m,
  "Inundasi 15 m": inundasi15m,
  "Inundasi 20 m": inundasi20m,
};

map.addLayer(markers); // Add Shelter Evakuasi layer to the map initially
map.addLayer(bahayaTsunami); // Add Bahaya Tsunami layer to the map initially

var layerControl = L.control
  .layers(baseMaps, overlayLayers, {
    collapsed: true, // Keep the control expanded
  })
  .addTo(map);

// custom layer control
var headingElement = document.createElement("h3");
headingElement.textContent = "Pilih Basemap";

var leafletLayersList = document.querySelector(".leaflet-control-layers-list");
if (leafletLayersList) {
  var firstChild = leafletLayersList.firstChild;
  leafletLayersList.insertBefore(headingElement, firstChild);
}

var headingElement = document.createElement("h3");
headingElement.textContent = "Pilih Layer";

var leafletControlLayers = document.querySelector(".leaflet-control-layers-overlays");
if (leafletControlLayers) {
  var firstChild = leafletControlLayers.firstChild;
  leafletControlLayers.insertBefore(headingElement, firstChild);

    // Menambahkan h3 dengan teks "Inundasi Tsunami" setelah label ke-7
    var inundasiHeading = document.createElement("h3");
    inundasiHeading.textContent = "Inundasi Tsunami";
  
    // Temukan label ke-7 (Area Pemukiman)
    var labels = leafletControlLayers.getElementsByTagName("label");
    if (labels.length >= 7) {
      var areaPemukimanLabel = labels[6]; // index 6 adalah label ke-7 karena index dimulai dari 0
      areaPemukimanLabel.parentNode.insertBefore(inundasiHeading, areaPemukimanLabel.nextSibling);
    }
}

// Ensure the initial checkbox state reflects the layers added
function setInitialLayerControlState() {
  // Use a small timeout to ensure checkboxes are available in the DOM
  setTimeout(function () {
    // Select all checkboxes and update their state based on the layer name
    document.querySelectorAll('.leaflet-control-layers-selector[type="checkbox"]').forEach(function (checkbox) {
      var label = checkbox.nextSibling;
      var layerName = label ? label.innerText.trim() : "";
      if (layerName === "Shelter Evakuasi" || layerName === "Bahaya Tsunami") {
        checkbox.checked = true; // Check the box for selected layers
      } else {
        checkbox.checked = false; // Uncheck the box for other layers
      }
    });
  }, 0);
}

// Set the initial state after the DOM has fully loaded
window.addEventListener("load", setInitialLayerControlState);

// Cari elemen label "Bahaya Tsunami" dan tambahkan class "padding-left"
setTimeout(function () {
  var labels = document.querySelectorAll(".leaflet-legend-item span");
  labels.forEach(function (label) {
    if (label.innerText.includes("Bahaya Tsunami")) {
      label.classList.add("padding-left");
    }
  });
}, 500);

// Fungsi untuk menghapus elemen <i> pada label "Bahaya Tsunami"
function removeIconFromLabel(labelText) {
  // Cari semua elemen yang mengandung label di dalam legenda
  var legendItems = document.querySelectorAll(".leaflet-legend-item");

  legendItems.forEach(function (item) {
    // Periksa apakah teks label sesuai dengan "Bahaya Tsunami"
    if (item.textContent.includes(labelText)) {
      // Cari elemen <i> di dalam item dan hapus
      var icon = item.querySelector("i");
      if (icon) {
        icon.remove();
      }
    }
  });
}

// Panggil fungsi setelah legenda ditambahkan ke peta
removeIconFromLabel("Bahaya Tsunami");
