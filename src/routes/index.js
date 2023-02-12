const express = require("express");
const router = express.Router();
const kubernetesController = require("../controllers/kubernetesController");
const healthController = require("../controllers/healthController");

/* GET home page. */
router.post("/", kubernetesController.fetchDeploymentInfo);
router.get("/health", healthController.healthCheck);
module.exports = router;
