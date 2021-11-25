console.log('adam')
mapboxgl.accessToken = 'pk.eyJ1IjoidHJhbnNpcmVudCIsImEiOiJja255bXRtZGowbHF0MnBvM3U4d2J1ZG5vIn0.IVcxB9Xw6Tcc8yHGdK_0zA';
console.log('adam')
let latitude = document.querySelector('#latitudeDiv').innerText;
let longitude = document.querySelector('#longitudeDiv').innerText;
console.log(latitude);
const longLat = [+latitude, +longitude];

const map = new mapboxgl.Map({
	container: 'map', // container ID
	style: "mapbox://styles/mapbox/streets-v11", // style URL
	// doubleClickZoom: false,
	center: longLat, // starting position [lng, lat]
	zoom: 15, // starting zoom
	// pitch: 100
});

const nav = new mapboxgl.NavigationControl()
map.addControl(nav, 'top-left')

console.log(longLat);
new mapboxgl.Marker({
  color: 'red',
  draggable: false,
})
  .setLngLat(longLat)
  .addTo(map);