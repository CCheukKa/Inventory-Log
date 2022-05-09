// const propertySets = document.getElementsByClassName('property-set');
// for (let i = 0; i < propertySets.length; i++) {
//     const propertySet = propertySets[i];
//     propertySet.getElementsByClassName('add')[0].onclick = post({ message: 'this is request message' });
// }

postHttp('properties', (data, status) => {
    data = JSON.parse(data);
    console.log({ status, data });
});