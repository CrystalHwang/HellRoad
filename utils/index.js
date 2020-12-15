export const transformCoordinatesArray = (arrayOfLatLng) => {
  const transformedArray = arrayOfLatLng.map((element) => {
    return { 'latitude': element[1], 'longitude': element[0] };
  });

  return transformedArray;
};

export const getLatLngFromAPIData = (response) => {
  const locationData = response.data.results[0].geometry.location;

  return { 'latitude': locationData.lat, 'longitude': locationData.lng };
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
