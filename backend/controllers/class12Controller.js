const Course = require("../models/Course");
const College = require("../models/College");

/**
 * Normalization Mapping Rule:
 * Architecture -> Engineering
 * IT & Computer -> Engineering
 * Arts / Commerce / Science / Design / Media & Journalism -> Arts & Science
 * Hotel Management -> Others
 * ITI -> Polytechnic
 * Agriculture -> Agriculture
 * Medical -> Medical
 * Law -> Law
 * Polytechnic -> Polytechnic
 */
const CATEGORY_MAP = {
  "Architecture": "Engineering",
  "IT & Computer": "Engineering",
  "Arts": "Arts & Science",
  "Commerce": "Arts & Science",
  "Science": "Arts & Science",
  "Design": "Arts & Science",
  "Media & Journalism": "Arts & Science",
  "Hotel Management": "Others",
  "ITI": "Polytechnic",
  "Agriculture": "Agriculture",
  "Engineering": "Engineering",
  "Medical": "Medical",
  "Law": "Law",
  "Polytechnic": "Polytechnic",
  "Others": "Others"
};

const MASTER_CATEGORIES = [
  "Engineering",
  "Medical",
  "Arts & Science",
  "Law",
  "Polytechnic",
  "Agriculture",
  "Others"
];

exports.getClass12Categories = async (req, res) => {
  try {
    const courses = await Course.find({ 
      isPublished: true, 
      status: "active",
      level: { $in: ["After 12th", "Diploma"] } 
    }).select("category");

    const colleges = await College.find().select("stream");

    const stats = MASTER_CATEGORIES.map(cat => {
      const courseCount = courses.filter(c => CATEGORY_MAP[c.category] === cat).length;
      const collegeCount = colleges.filter(clg => clg.stream === cat).length;
      return {
        categoryName: cat,
        courseCount,
        collegeCount
      };
    });

    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getClass12Content = async (req, res) => {
  try {
    const { category, search } = req.query;

    let courseQuery = { isPublished: true, status: "active", level: { $in: ["After 12th", "Diploma"] } };
    let collegeQuery = {};

    if (search) {
      courseQuery.courseName = { $regex: search, $options: "i" };
      collegeQuery.$or = [
        { collegeName: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
        { district: { $regex: search, $options: "i" } }
      ];
    }

    const allCourses = await Course.find(courseQuery).select("courseName level category duration sourceName slug status isPublished");
    const allColleges = await College.find(collegeQuery).select("collegeName stream district location coursesOffered slug");

    const result = MASTER_CATEGORIES.map(cat => {
      // Filter courses that map to this parent category
      const catCourses = allCourses.filter(c => CATEGORY_MAP[c.category] === cat);
      // Filter colleges that match this stream
      const catColleges = allColleges.filter(clg => clg.stream === cat);

      return {
        categoryName: cat,
        courseCount: catCourses.length,
        collegeCount: catColleges.length,
        courses: catCourses,
        colleges: catColleges
      };
    });

    // If a specific category was requested, only return that one
    if (category) {
      const filtered = result.find(r => r.categoryName.toLowerCase() === category.toLowerCase());
      return res.json({ success: true, data: filtered || null });
    }

    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
