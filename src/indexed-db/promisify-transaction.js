const promisifyTransaction = request =>
  new Promise((resolve, reject) => {
    const handleError = () => {
      request.removeEventListener('error', handleError);
      reject(request.error);
    };
    request.addEventListener('error', handleError);

    const handleSuccess = event => {
      request.removeEventListener('success', handleSuccess);
      resolve(event.target.result);
    };
    request.addEventListener('success', handleSuccess);
  });

export default promisifyTransaction;
