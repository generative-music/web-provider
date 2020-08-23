const get = (urls = []) =>
  Promise.all(
    urls.map(url =>
      fetch(url)
        .then(response => response.arrayBuffer())
        .catch(() => null)
    )
  );

export default get;
