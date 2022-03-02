import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import {
  GoogleMap,
  Marker,
  DirectionsRenderer,
  Circle,
  MarkerClusterer,
} from '@react-google-maps/api';
import Places from './places';
import Distance from './distance';

type LatLngLiteral = google.maps.LatLngLiteral;
type DirectionsResult = google.maps.DirectionsResult;
type MapOptions = google.maps.MapOptions;

export default function Map() {
  const [office, setOffice] = useState<LatLngLiteral>();
  const [directions, setDirections] = useState<DirectionsResult>();

  // Map reference
  const mapRef = useRef<GoogleMap>();

  const center = useMemo<LatLngLiteral>(
    () => ({ lat: 5.555558, lng: -0.344305 }),
    []
  );
  // Disable default option
  const options = useMemo<MapOptions>(
    () => ({
      disableDefaultUI: true,
      clickableIcons: false,
    }),
    []
  );

  // Save an instance of the map view
  const onLoad = useCallback((map) => {
    mapRef.current;
  }, []);
  // Generate houses
  const houses = useMemo(() => generateHouses(center), [center]);
  // Get the direction of a house when clicked
  const fetchDirections = (house: LatLngLiteral) => {
    if (!office) return;
    const directionsService = new google.maps.DirectionsService();
    directionsService.route(
      {
        origin: office,
        destination: house,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === 'OK' && result) {
          setDirections(result);
        }
      }
    );
  };

  console.log(houses);

  return (
    <div className='container'>
      <div className='controls'>
        <h1>Commute?</h1>
        <Places
          setOffice={(position) => {
            setOffice(position);
            mapRef.current?.panTo(position);
          }}
        />
        {!office && <p>Enter the address of your office.</p>}
        {directions && <Distance leg={directions.routes[0].legs[0]} />}
      </div>
      <div className='map'>
        <GoogleMap
          zoom={10}
          center={center}
          options={options}
          onLoad={onLoad}
          mapContainerClassName='map-container'>
          {directions && (
            <DirectionsRenderer
              directions={directions}
              options={{
                suppressMarkers: true,
                polylineOptions: {
                  strokeColor: '#1976d2',
                  strokeWeight: 5,
                  zIndex: 50,
                },
              }}
            />
          )}

          {office && (
            <>
              <Marker
                position={office}
                icon='https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png'
              />
              <MarkerClusterer>
                {(clusterer) =>
                  houses.map((house) => (
                    <Marker
                      key={house.lat}
                      position={house}
                      clusterer={clusterer}
                      onClick={() => {
                        fetchDirections(house);
                      }}
                    />
                  ))
                }
              </MarkerClusterer>

              <Circle center={office} radius={15000} options={closeOptions} />
              <Circle center={office} radius={30000} options={middleOptions} />
              <Circle center={office} radius={60000} options={farOptions} />
            </>
          )}
        </GoogleMap>
      </div>
    </div>
  );
}

const defaultOptions = {
  strokeOpacity: 0.3,
  strokeWeight: 2,
  clickable: false,
  draggable: false,
  editable: false,
  visible: true,
};

const closeOptions = {
  ...defaultOptions,
  zIndex: 2,
  fillOpacity: 0.3,
  strokeColor: '#8bc34a',
  fillColor: '#8bc34a',
};

const middleOptions = {
  ...defaultOptions,
  zIndex: 2,
  fillOpacity: 0.3,
  strokeColor: '#fbc02d',
  fillColor: '#fbc02d',
};

const farOptions = {
  ...defaultOptions,
  zIndex: 1,
  fillOpacity: 0.3,
  strokeColor: '#ff5252',
  fillColor: '#ff5252',
};

const generateHouses = (position: LatLngLiteral) => {
  const _houses: Array<LatLngLiteral> = [];
  for (let i = 0; i < 50; i++) {
    const direction = Math.random() < 0.5 ? -2 : 2;
    _houses.push({
      lat: position.lat + Math.random() / direction,
      lng: position.lng + Math.random() / direction,
    });
  }

  return _houses;
};
