const logger = (req, res, next) => {
  const start = new Date();
  res.on('finish', () => {
    console.log({
      method: req.method,
      path: req.path,
      status: res.statusCode,
      duration: new Date() - start + 'ms',
      userIP: req.ip,
      userId: req.user?.userId
    });
  });
  next();
};

module.exports = logger;
