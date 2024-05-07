export function createMarkerIcon(number) {
    const svgMarker = {
      fillColor: '%23FF6B6B',
      fillOpacity: 1,
    };

    return {
      url: `data:image/svg+xml;utf-8, 
        <svg viewBox="0 0 50 80" xmlns="http://www.w3.org/2000/svg">
          <path d="M25,0 C38.81,0 50,11.19 50,25 C50,38.81 38.81,60 25,80 C11.19,60 0,38.81 0,25 C0,11.19 11.19,0 25,0 Z" fill="${svgMarker.fillColor}" fill-opacity="${svgMarker.fillOpacity}"/>
          <text x="50%" y="30%" alignment-baseline="middle" text-anchor="middle" fill="white" font-size="20" font-family="Helvetica" font-weight="bold">${number}</text>
        </svg>`,
      scaledSize: new google.maps.Size(50, 60),
      
    };
}
