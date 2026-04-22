const express = require("express");
const router = express.Router();
const { saveMapping, getMappings, getSuggestedMappings, bulkAutoMap, scanWebsite, deduplicateMappings } = require("../controllers/collegeCourseController");
const verifyAdmin = require("../middleware/verifyAdmin");

router.post("/", verifyAdmin, saveMapping);
router.post("/bulk-map", verifyAdmin, bulkAutoMap);
router.post("/scan-website", verifyAdmin, scanWebsite);
router.post("/deduplicate", verifyAdmin, deduplicateMappings);
router.get("/", getMappings);
router.get("/suggested/:collegeId", verifyAdmin, getSuggestedMappings);

module.exports = router;
