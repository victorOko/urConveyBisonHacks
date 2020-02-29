function calculateRouteFromAtoB(platform) {
  var router = platform.getRoutingService(),
    routeRequestParams = {
      mode: "fastest;car",
      representation: "display",
      routeattributes: "waypoints,summary,shape,legs",
      maneuverattributes: "direction,action",
      waypoint0: "52.51605,13.37787", // Brandenburg Gate
      waypoint1: "52.52058,13.38615" // Friedrichstraße Railway Station
    };

  router.calculateRoute(routeRequestParams, onSuccess, onError);
}

function onSuccess(result) {
  var route = result.response.route[0];

  addRouteShapeToMap(route);
  addManueversToMap(route);

  addWaypointsToPanel(route.waypoint);
  addManueversToPanel(route);
  addSummaryToPanel(route.summary);
}

function onError(error) {
  alert("Can't reach the remote server");
}

var mapContainer = document.getElementById("map"),
  routeInstructionsContainer = document.getElementById("panel");

var platform = new H.service.Platform({
  apikey: window.apikey
});

var defaultLayers = platform.createDefaultLayers();

var map = new H.Map(mapContainer, defaultLayers.vector.normal.map, {
  center: { lat: 52.516, lng: 13.3779 },
  zoom: 13,
  pixelRatio: window.devicePixelRatio || 1
});

window.addEventListener("resize", () => map.getViewPort().resize());

var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));

var ui = H.ui.UI.createDefault(map, defaultLayers);

var bubble;

function openBubble(position, text) {
  if (!bubble) {
    bubble = new H.ui.InfoBubble(
      position,

      { content: text }
    );
    ui.addBubble(bubble);
  } else {
    bubble.setPosition(position);
    bubble.setContent(text);
    bubble.open();
  }
}

function addRouteShapeToMap(route) {
  var lineString = new H.geo.LineString(),
    routeShape = route.shape,
    polyline;

  routeShape.forEach(function(point) {
    var parts = point.split(",");
    lineString.pushLatLngAlt(parts[0], parts[1]);
  });

  polyline = new H.map.Polyline(lineString, {
    style: {
      lineWidth: 4,
      strokeColor: "rgba(0, 128, 255, 0.7)"
    }
  });

  map.addObject(polyline);

  map.getViewModel().setLookAtData({
    bounds: polyline.getBoundingBox()
  });
}

function addManueversToMap(route) {
  var svgMarkup =
      '<svg width="18" height="18" ' +
      'xmlns="http://www.w3.org/2000/svg">' +
      '<circle cx="8" cy="8" r="8" ' +
      'fill="#1b468d" stroke="white" stroke-width="1"  />' +
      "</svg>",
    dotIcon = new H.map.Icon(svgMarkup, { anchor: { x: 8, y: 8 } }),
    group = new H.map.Group(),
    i,
    j;

  for (i = 0; i < route.leg.length; i += 1) {
    for (j = 0; j < route.leg[i].maneuver.length; j += 1) {
      maneuver = route.leg[i].maneuver[j];

      var marker = new H.map.Marker(
        {
          lat: maneuver.position.latitude,
          lng: maneuver.position.longitude
        },
        { icon: dotIcon }
      );
      marker.instruction = maneuver.instruction;
      group.addObject(marker);
    }
  }

  group.addEventListener(
    "tap",
    function(evt) {
      map.setCenter(evt.target.getGeometry());
      openBubble(evt.target.getGeometry(), evt.target.instruction);
    },
    false
  );

  map.addObject(group);
}

function addWaypointsToPanel(waypoints) {
  var nodeH3 = document.createElement("h3"),
    waypointLabels = [],
    i;

  for (i = 0; i < waypoints.length; i += 1) {
    waypointLabels.push(waypoints[i].label);
  }
  nodeH3.textContent = waypointLabels.join(" - ");

  routeInstructionsContainer.innerHTML = "";
  routeInstructionsContainer.appendChild(nodeH3);
}

function addSummaryToPanel(summary) {
  var summaryDiv = document.createElement("div"),
    content = "";
  content += "<b>Total distance</b>: " + summary.distance + "m. <br/>";
  content +=
    "<b>Travel Time</b>: " +
    summary.travelTime.toMMSS() +
    " (in current traffic)";

  summaryDiv.style.fontSize = "small";
  summaryDiv.style.marginLeft = "5%";
  summaryDiv.style.marginRight = "5%";
  summaryDiv.innerHTML = content;
  routeInstructionsContainer.appendChild(summaryDiv);
}

function addManueversToPanel(route) {
  var nodeOL = document.createElement("ol"),
    i,
    j;

  nodeOL.style.fontSize = "small";
  nodeOL.style.marginLeft = "5%";
  nodeOL.style.marginRight = "5%";
  nodeOL.className = "directions";

  for (i = 0; i < route.leg.length; i += 1) {
    for (j = 0; j < route.leg[i].maneuver.length; j += 1) {
      maneuver = route.leg[i].maneuver[j];

      var li = document.createElement("li"),
        spanArrow = document.createElement("span"),
        spanInstruction = document.createElement("span");

      spanArrow.className = "arrow " + maneuver.action;
      spanInstruction.innerHTML = maneuver.instruction;
      li.appendChild(spanArrow);
      li.appendChild(spanInstruction);

      nodeOL.appendChild(li);
    }
  }

  routeInstructionsContainer.appendChild(nodeOL);
}

Number.prototype.toMMSS = function() {
  return Math.floor(this / 60) + " minutes " + (this % 60) + " seconds.";
};

calculateRouteFromAtoB(platform);
