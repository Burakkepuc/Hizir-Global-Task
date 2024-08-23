const notFound = (req, res, next) => {
  res.status(500).json({
    success: false,
    message: 'Not found',
  });
};


module.exports = notFound;