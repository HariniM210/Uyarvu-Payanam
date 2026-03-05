const mongoose = require("mongoose");
const path = require("path");
const dotenv = require("dotenv");
const Scholarship = require("../models/Scholarship");

// Load environment variables
dotenv.config({ path: path.join(__dirname, "../.env") });

const dataset = [
    {
        "scholarshipName": "Central Sector Scheme of Scholarship for College and University Students",
        "provider": "Ministry of Education, Government of India",
        "eligibility": "Students above 80th percentile in Class 12 and family income below ₹4.5 lakh",
        "amount": "₹12,000/year (UG), ₹20,000/year (PG)",
        "applicationLink": "https://scholarships.gov.in"
    },
    {
        "scholarshipName": "AICTE Pragati Scholarship for Girls",
        "provider": "AICTE",
        "eligibility": "Girls admitted to AICTE approved technical courses",
        "amount": "₹50,000 per year",
        "applicationLink": "https://scholarships.gov.in"
    },
    {
        "scholarshipName": "AICTE Saksham Scholarship",
        "provider": "AICTE",
        "eligibility": "Students with disabilities pursuing technical education",
        "amount": "₹50,000 per year",
        "applicationLink": "https://scholarships.gov.in"
    },
    {
        "scholarshipName": "National Means Cum Merit Scholarship",
        "provider": "Ministry of Education",
        "eligibility": "Students from economically weaker sections in Class 9",
        "amount": "₹12,000 per year",
        "applicationLink": "https://scholarships.gov.in"
    },
    {
        "scholarshipName": "Post Matric Scholarship for SC Students",
        "provider": "Ministry of Social Justice and Empowerment",
        "eligibility": "SC students studying after Class 10",
        "amount": "Variable depending on course",
        "applicationLink": "https://scholarships.gov.in"
    },
    {
        "scholarshipName": "Post Matric Scholarship for ST Students",
        "provider": "Ministry of Tribal Affairs",
        "eligibility": "ST students pursuing post matric education",
        "amount": "Variable depending on course",
        "applicationLink": "https://scholarships.gov.in"
    },
    {
        "scholarshipName": "Merit Cum Means Scholarship for Minority Students",
        "provider": "Ministry of Minority Affairs",
        "eligibility": "Minority students pursuing professional courses",
        "amount": "₹20,000 per year",
        "applicationLink": "https://scholarships.gov.in"
    },
    {
        "scholarshipName": "INSPIRE Scholarship",
        "provider": "Department of Science and Technology",
        "eligibility": "Top science students pursuing BSc or MSc",
        "amount": "₹80,000 per year",
        "applicationLink": "https://online-inspire.gov.in"
    },
    {
        "scholarshipName": "UGC Ishan Uday Scholarship",
        "provider": "University Grants Commission",
        "eligibility": "Students from North Eastern Region",
        "amount": "₹5,400 per month",
        "applicationLink": "https://scholarships.gov.in"
    },
    {
        "scholarshipName": "Prime Minister Scholarship Scheme",
        "provider": "Ministry of Home Affairs",
        "eligibility": "Children of ex-servicemen and CAPF personnel",
        "amount": "₹30,000 per year",
        "applicationLink": "https://scholarships.gov.in"
    },
    {
        "scholarshipName": "National Fellowship for SC Students",
        "provider": "Ministry of Social Justice",
        "eligibility": "SC students pursuing MPhil or PhD",
        "amount": "₹31,000 per month",
        "applicationLink": "https://scholarships.gov.in"
    },
    {
        "scholarshipName": "National Fellowship for ST Students",
        "provider": "Ministry of Tribal Affairs",
        "eligibility": "ST students pursuing higher research",
        "amount": "₹31,000 per month",
        "applicationLink": "https://scholarships.gov.in"
    },
    {
        "scholarshipName": "Begum Hazrat Mahal National Scholarship",
        "provider": "Ministry of Minority Affairs",
        "eligibility": "Minority girls studying in classes 9-12",
        "amount": "₹6,000 per year",
        "applicationLink": "https://scholarships.gov.in"
    },
    {
        "scholarshipName": "Top Class Education Scheme for SC Students",
        "provider": "Ministry of Social Justice",
        "eligibility": "SC students studying in top institutions",
        "amount": "₹2,00,000 per year",
        "applicationLink": "https://scholarships.gov.in"
    },
    {
        "scholarshipName": "Top Class Education Scheme for ST Students",
        "provider": "Ministry of Tribal Affairs",
        "eligibility": "ST students studying in premier institutions",
        "amount": "₹2,00,000 per year",
        "applicationLink": "https://scholarships.gov.in"
    }
];

const insertScholarships = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connected");

        await Scholarship.deleteMany({});

        await Scholarship.insertMany(dataset);

        console.log("Scholarship dataset inserted successfully");

        process.exit(0);
    } catch (error) {
        console.error("Error inserting data:", error);
        process.exit(1);
    }
};

insertScholarships();
