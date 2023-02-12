async function healthCheck(req, res, next) {
  return res.status(200).send("Healthy");
}

module.exports = {
  healthCheck,
};
