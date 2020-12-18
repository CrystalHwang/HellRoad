import { getDistance } from 'geolib';

export const getLatLngFromAPIData = (response) => {
  const locationData = response.data.results[0].geometry.location;

  return { 'latitude': locationData.lat, 'longitude': locationData.lng };
};

export const transformCoordinatesArrayForMapBox = (arrayOfLatLng) => {
  const transformedArray = arrayOfLatLng.map((element) => {
    return { 'latitude': element[1], 'longitude': element[0] };
  });

  return transformedArray;
};

export const transformCoordinatesArrayForMapQuest = (arrayOfLatLng) => {
  const transformedArray = [];

  for (let i = 0; i < arrayOfLatLng.length; i += 2) {
    const index = Math.floor(i / 2);
    transformedArray[index] = { 'latitude': arrayOfLatLng[i], 'longitude': arrayOfLatLng[i + 1] };
  }

  return transformedArray;
};

export const transformCoordinatesArrayForTMap = (arrayOfPathObject) => {
  const coordinatesArray = [];

  arrayOfPathObject?.forEach((pathObject, index) => {
    const pathData = pathObject.geometry.coordinates;

    if (Array.isArray(pathData[0])) {
      pathData.forEach((coord, index) => {
        const lastIndex = coordinatesArray.length - 1;
        const longitude = coord[0];
        const latitude = coord[1];
        if (!coordinatesArray.length) {
          coordinatesArray.push({ 'latitude': latitude, 'longitude': longitude });
        } else if (coordinatesArray[lastIndex].latitude !== latitude || coordinatesArray[lastIndex].longitude !== longitude) {
          coordinatesArray.push({ 'latitude': latitude, 'longitude': longitude });
        }
      });
    } else {
      const lastIndex = coordinatesArray.length - 1;
      const longitude = pathData[0];
      const latitude = pathData[1];

      if (!coordinatesArray.length) {
        coordinatesArray.push({ 'latitude': latitude, 'longitude': longitude });
      } else if (coordinatesArray[lastIndex].latitude !== latitude || coordinatesArray[lastIndex].longitude !== longitude) {
        coordinatesArray.push({ 'latitude': latitude, 'longitude': longitude });
      }
    }
  });

  return coordinatesArray;
};

export const convertedToRoundedMinutes = (duration) => {
  if (typeof duration === "number") {
    const roundedMinutes = Math.floor((duration + 0.5) / 60);

    return roundedMinutes;
  }

  const hours = Number(duration.slice(0, 2));
  const minutes = Number(duration.slice(3, 5));
  const seconds = Number(duration.slice(6, 8));

  let convertedMinutes = 0;

  if (hours) {
    convertedMinutes += hours * 60;
  }

  if (minutes) {
    convertedMinutes += minutes;
  }

  if (seconds) {
    convertedMinutes += Math.floor((seconds + 30) / 60);
  }

  return convertedMinutes;
};

export const findBoundingBoxCoordinates = (arrayOfCoords) => {
  const boundingBox = {
    up: arrayOfCoords[0].latitude, // 위도 중에 가장 값이 큰 것
    down: arrayOfCoords[0].latitude, // 위도 중에 가장 값이 작은 것
    left: arrayOfCoords[0].longitude, // 경도 중에 가장  값이 작은 것
    right: arrayOfCoords[0].longitude, // 경도 중에 가장 값이 큰 것
  };

  arrayOfCoords.forEach((coords, index) => {
    if (coords.latitude > boundingBox.up) {
      boundingBox.up = coords.latitude;
    }

    if (coords.latitude < boundingBox.down) {
      boundingBox.down = coords.latitude;
    }

    if (coords.longitude < boundingBox.left) {
      boundingBox.left = coords.longitude;
    }

    if (coords.longitude > boundingBox.right) {
      boundingBox.right = coords.longitude;
    }
  });

  return boundingBox;
};

export const getTheNearestDangerousPoint = (currentLocation, markers) => {
  let nearestLocation = {
    latitude: '',
    longitude: '',
  };

  let minDistance = Number.MAX_VALUE;

  markers.forEach((marker, index) => {
    console.log("가장 위험한 포인트 얻기위해서 계산 중입니다!!!!!!!!!!!! MARKER", marker.geometry.coordinates, "index", index);
    const longitude = marker.geometry.coordinates[0];
    const latitude = marker.geometry.coordinates[1];
    const distance = getDistance(currentLocation, { latitude, longitude });


    if (minDistance > distance) {
      minDistance = distance;
      nearestLocation.latitude = latitude;
      nearestLocation.longitude = longitude;
    }

    minDistance = minDistance > distance ? distance : minDistance;
  });

  return { minDistance, nearestLocation };
};

export const getDistanceFromDestination = (currentLocation, destinationLocation) => {
  const distance = getDistance(currentLocation, destinationLocation);

  return distance;
};
