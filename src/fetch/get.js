const get = (urls = []) =>
  Promise.all(
    urls.map(url => fetch(url).then(response => response.arrayBuffer()))
  );

export default get;
