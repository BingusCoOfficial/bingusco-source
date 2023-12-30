mapboxgl.accessToken = 'pk.eyJ1IjoibXJoZHVtcHR5IiwiYSI6ImNsa212ZXQzcjA1aHUzbG9jM3VxMzFicTgifQ.maRgNHj9DMj7X5fJ1uPkkg';

window.onload = function () {
  console.log("window.onload: Page loaded.");
  navigator.geolocation.getCurrentPosition(
    showPosition,
    handleGeolocationError,
    { timeout: 5000 }
  );
};

window.addEventListener('message', function(event) {
    if (event.data && event.data.type === 'position' && event.data.position) {
      var newPosition = event.data.position;
      window.parent.postMessage({
        type: 'position',
        position: newPosition,
      }, '*');
    }
  });

function showPosition(position) {
  const lat = position.coords.latitude;
  const long = position.coords.longitude;
  console.log(`showPosition: Latitude: ${lat}, Longitude: ${long}`);
  addMap(lat, long);
}

function handleGeolocationError(error) {
  console.log("Geolocation error occurred:", error);
  if (!localStorage.getItem("country")) {
    openCustomAlert();
  } else {
    const country = localStorage.getItem("country");
    const middleLoc = {
      Scotland: [56.816738, -4.183963],
      England: [52.561928, -1.464854],
      Wales: [52.33022, -3.766409],
      Ireland: [54.607577, -6.693145]
    };
    const [lat, long] = middleLoc[country];
    addMap(lat, long)
  }
}

function openCustomAlert() {
  document.getElementById("custom-alert").style.display = "block";
  document.getElementById("bg").style.display = "block";
}

function handleCustomAlert() {
  const selectedCountry = document.querySelector('input[name="country"]:checked');
  if (selectedCountry) {
    const country = selectedCountry.value;
    localStorage.setItem("country", country)
    const middleLoc = {
      Scotland: [56.816738, -4.183963],
      England: [52.561928, -1.464854],
      Wales: [52.33022, -3.766409],
      Ireland: [54.607577, -6.693145]
    };
    const [lat, long] = middleLoc[country];
    console.log(`Selected country: ${country}, Latitude: ${lat}, Longitude: ${long}`);
    addMap(lat, long);
    closeCustomAlert();
  }
}

function closeCustomAlert() {
  document.getElementById("custom-alert").style.display = "none";
  document.getElementById("bg").style.display = "none";
}

function addMap(lat, long) {
  var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/satellite-streets-v12',
    center: [long, lat],
    zoom: 20,
    maxZoom: 25,
    attributionControl: false,
    hash: true,
    projection: "mercator",
    antialias: true
  });

  const modelOrigin = [-3.7916457632272795, 56.15042343899606];
  const modelAltitude = 0;
  const modelRotate = [Math.PI / 2, 0, 0];
   
  const modelAsMercatorCoordinate = mapboxgl.MercatorCoordinate.fromLngLat(
    modelOrigin,
    modelAltitude
  );
   
  const modelTransform = {
    translateX: modelAsMercatorCoordinate.x,
    translateY: modelAsMercatorCoordinate.y,
    translateZ: modelAsMercatorCoordinate.z,
    rotateX: modelRotate[0],
    rotateY: modelRotate[1],
    rotateZ: modelRotate[2],
    scale: modelAsMercatorCoordinate.meterInMercatorCoordinateUnits()
  };
      
  const customLayer = {
    id: '3d-model',
    type: 'custom',
    renderingMode: '3d',
    onAdd: function (map, gl) {
      this.camera = new THREE.Camera();
      this.scene = new THREE.Scene();
       
      const directionalLight = new THREE.DirectionalLight(0xffffff);
      directionalLight.position.set(0, -70, 100).normalize();
      this.scene.add(directionalLight);
       
      const directionalLight2 = new THREE.DirectionalLight(0xffffff);
      directionalLight2.position.set(0, 70, 100).normalize();
      this.scene.add(directionalLight2);
       
      const loader = new THREE.GLTFLoader();
      loader.load(
        'https://docs.mapbox.com/mapbox-gl-js/assets/34M_17/34M_17.gltf',
        (gltf) => {
          this.scene.add(gltf.scene);
        }
      );
      this.map = map;
       
      this.renderer = new THREE.WebGLRenderer({
        canvas: map.getCanvas(),
        context: gl,
        antialias: true
      });
       
      this.renderer.autoClear = false;
    },
    render: function (gl, matrix) {
      const rotationX = new THREE.Matrix4().makeRotationAxis(
        new THREE.Vector3(1, 0, 0),
        modelTransform.rotateX
      );
      const rotationY = new THREE.Matrix4().makeRotationAxis(
        new THREE.Vector3(0, 1, 0),
        modelTransform.rotateY
      );
      const rotationZ = new THREE.Matrix4().makeRotationAxis(
        new THREE.Vector3(0, 0, 1),
        modelTransform.rotateZ
      );  
      const m = new THREE.Matrix4().fromArray(matrix);
      const l = new THREE.Matrix4()
      .makeTranslation(
        modelTransform.translateX,
        modelTransform.translateY,
        modelTransform.translateZ
      )
      .scale(
        new THREE.Vector3(
          modelTransform.scale,
          -modelTransform.scale,
          modelTransform.scale
        )
      )
      .multiply(rotationX)
      .multiply(rotationY)
      .multiply(rotationZ);
       
      this.camera.projectionMatrix = m.multiply(l);
      this.renderer.resetState();
      this.renderer.render(this.scene, this.camera);
      this.map.triggerRepaint();
    }
  };
  
  map.addControl(new mapboxgl.NavigationControl({showCompass: false, showZoom: false}));
  map.addControl(
    new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl: mapboxgl
    })
  );
  map.on('load', function() {
    console.log("Map loaded successfully.");
    map.addSource('mapbox-dem', {
      'type': 'raster-dem',
      'url': 'mapbox://mapbox.mapbox-terrain-dem-v1',
      'tileSize': 512,
      'maxzoom': 14
    });
    map.setTerrain({ 
      'source': 'mapbox-dem', 
      'exaggeration': 1.5 
    });
  });
  
  map.on("style.load", () => {
    map.addLayer(customLayer, 'waterway-label');
    const layers = map.getStyle().layers;
    const labelLayerId = layers.find((layer) => layer.type === 'symbol' && layer.layout['text-field']).id;
    map.addSource("extras", {
      "type": "geojson",
      "data": "extras.geojson"
    });
    map.addLayer({
      "id": "extras",
      "type": "symbol",
      "source": "extras",
      "layout": {
          "icon-image": "suitcase",
          "text-field": ['get', 'name'],
          "text-font": ["Rubik Regular", "Arial Unicode MS Bold"],
          "text-offset": [0, 1],
          "text-anchor": "top"
      },
      "paint": {
        'text-color': ['get', 'color']
      }
    });
    map.addLayer({
      'id': 'add-3d-buildings',
      'source': 'composite',
      'source-layer': 'building',
      'filter': ['==', 'extrude', 'true'],
      'type': 'fill-extrusion',
      'minzoom': 15,
      'paint': {
        'fill-extrusion-color': '#aaa',
        'fill-extrusion-height': [
          'interpolate',
          ['linear'],
          ['zoom'],
          15,
          0,
          15.05,
          ['get', 'height']
        ],
        'fill-extrusion-base': [
          'interpolate',
          ['linear'],
          ['zoom'],
          15,
          0,
          15.05,
          ['get', 'min_height']
        ],
        'fill-extrusion-opacity': 0.6
      }
    }, labelLayerId);
  });
  const projectionInput = document.getElementById("projection");
  projectionInput.addEventListener('change', (e) => {
    map.setProjection(e.target.value);
  });
}