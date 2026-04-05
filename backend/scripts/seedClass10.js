const mongoose = require('mongoose');
const dotenv = require('dotenv');
const ClassContent = require('../models/ClassContent');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/uyarvu-payanam";

const slugify = (text) => {
  return text.toLowerCase()
    .split(" ")
    .join("-")
    .replace(/[^\w-]+/g, "") + "-" + Math.random().toString(36).substr(2, 5);
};

const class10SeedData = [
  {
    title: "After 10th – Choosing the Right Path",
    sectionType: "Basics",
    category: "General",
    shortDescription: "Class 10 is the start of stream and career direction planning.",
    fullDescription: "After completing Class 10, students must decide their next pathway—Science, Commerce, Arts, or Diploma.",
    coverImage: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1200",
    status: "published",
    featured: true,
    displayOrder: 1,
    targetClass: "10"
  },
  {
    title: "Science Stream – PCM, PCB, and PCMB",
    sectionType: "Streams",
    category: "Science",
    shortDescription: "For engineering, medicine, and research.",
    fullDescription: "Ideal for Engineering and Medical Aspirants.",
    benefitType: "Degree Paths",
    coverImage: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=1200",
    status: "published",
    displayOrder: 2,
    targetClass: "10"
  },
  {
    title: "Commerce Stream – Business and Finance",
    sectionType: "Streams",
    category: "Commerce",
    shortDescription: "For finance, management, and professional roles.",
    fullDescription: "Leads to CA, CS, and Banking careers.",
    coverImage: "https://images.unsplash.com/photo-1454165833767-027ffea9e77b?q=80&w=1200",
    status: "published",
    displayOrder: 3,
    targetClass: "10"
  },
  {
    title: "Arts / Humanities – Society and Law",
    sectionType: "Streams",
    category: "Arts",
    shortDescription: "For students interested in society, law, and media.",
    fullDescription: "History, Political Science, Psychology. Excellent for Law and UPSC.",
    coverImage: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=1200",
    status: "published",
    displayOrder: 4,
    targetClass: "10"
  },
  {
    title: "Diploma / Polytechnic – Technical Focus",
    sectionType: "Streams",
    category: "Diploma",
    shortDescription: "Early technical specialization and industry-ready skills.",
    fullDescription: "Practical engineering training (3 years).",
    coverImage: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=1200",
    status: "published",
    displayOrder: 5,
    targetClass: "10"
  },
  {
    title: "Career Mapping by Stream",
    sectionType: "Careers",
    category: "Planning",
    shortDescription: "Connect your stream selection to future professional options.",
    fullDescription: "Detailed mapping of subjects to jobs.",
    coverImage: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1200",
    status: "published",
    displayOrder: 6,
    targetClass: "10"
  },
  {
    title: "Government Scholarships After 10th (India)",
    sectionType: "Scholarships",
    category: "Government",
    shortDescription: "Centralized government support for Class 11, 12, and beyond.",
    fullDescription: "NSP acts as a gateway for multiple central scholarship schemes.",
    externalLink: "https://scholarships.gov.in/",
    coverImage: "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?q=80&w=1200",
    status: "published",
    displayOrder: 7,
    targetClass: "10"
  },
  {
    title: "PM-YASASVI Post-Matric Scholarship",
    sectionType: "Scholarships",
    category: "Government",
    subCategoryLabel: "Merit",
    shortDescription: "Scholarship for OBC, EBC, and DNT students by MSJE.",
    fullDescription: "Tuition and maintenance support.",
    coverImage: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200",
    status: "published",
    displayOrder: 8,
    targetClass: "10"
  },
  {
    title: "NMMS Scholarship Continuation",
    sectionType: "Scholarships",
    category: "Merit",
    shortDescription: "Keep receiving ₹1,000/month if you qualified in Class 8.",
    fullDescription: "Support till Class 12.",
    coverImage: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=1200",
    status: "published",
    displayOrder: 9,
    targetClass: "10"
  },
  {
    title: "State Level Scholarships (Tamil Nadu)",
    sectionType: "Scholarships",
    category: "State Schemes",
    shortDescription: "Unique financial aid programs from the Govt of TN.",
    fullDescription: "Specific awards like Periyar Memorial Award.",
    externalLink: "https://www.tndce.tn.gov.in/",
    coverImage: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=1200",
    status: "published",
    displayOrder: 10,
    targetClass: "10"
  },
  {
    title: "How to Apply for Scholarships (Process)",
    sectionType: "Scholarships",
    category: "Process",
    shortDescription: "A clear guide to apply through NSP and other portals.",
    fullDescription: "Steps for successful application.",
    coverImage: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?q=80&w=1200",
    status: "published",
    displayOrder: 11,
    targetClass: "10"
  },
  {
    title: "Scholarship Checklist & Tips",
    sectionType: "Scholarships",
    category: "Tips",
    shortDescription: "Avoid common mistakes during application.",
    fullDescription: "Important pointers for students.",
    coverImage: "https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=1200",
    status: "published",
    displayOrder: 12,
    targetClass: "10"
  },
  {
    title: "Entrance Exams & Opportunities After 10th",
    sectionType: "Entrance Exams",
    category: "Scholarship Exam",
    shortDescription: "Explore talent exams and job opportunities.",
    fullDescription: "Overview of all major pathways.",
    coverImage: "https://images.unsplash.com/photo-1588072432836-e10032774350?q=80&w=1200",
    status: "published",
    displayOrder: 13,
    targetClass: "10"
  },
  {
    title: "National Talent Search Examination (NTSE)",
    sectionType: "Entrance Exams",
    category: "Scholarship Exam",
    shortDescription: "Premier national scholarship exam by NCERT.",
    fullDescription: "Stages and benefits of NTSE.",
    coverImage: "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?q=80&w=1200",
    status: "published",
    displayOrder: 14,
    targetClass: "10"
  },
  {
    title: "Tamil Nadu Rural Talent Search (TRUSTS)",
    sectionType: "Entrance Exams",
    category: "Scholarship Exam",
    subCategoryLabel: "TN Rural",
    shortDescription: "Targeted support for rural students in TN.",
    fullDescription: "Selected students receive ₹1,000/year.",
    coverImage: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=1200",
    status: "published",
    displayOrder: 15,
    targetClass: "10"
  },
  {
    title: "TN Technical & Vocational Exams",
    sectionType: "Entrance Exams",
    category: "Skill Exams",
    shortDescription: "Certifications for Drawing, Sewing, Music, etc.",
    fullDescription: "Grading for employment.",
    coverImage: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=1200",
    status: "published",
    displayOrder: 16,
    targetClass: "10"
  },
  {
    title: "Tamil Nadu Police Constable Career",
    sectionType: "Entrance Exams",
    category: "Government Job",
    shortDescription: "Join uniform services via TNUSRB.",
    fullDescription: "Minimum 10th pass recruitment.",
    coverImage: "https://images.unsplash.com/photo-1592188657297-c6473602410a?q=80&w=1200",
    status: "published",
    displayOrder: 17,
    targetClass: "10"
  },
  {
    title: "Indian Army Recruitment (GD)",
    sectionType: "Entrance Exams",
    category: "Defence Career",
    shortDescription: "Join the Army directly as a soldier.",
    fullDescription: "10th pass soldier entry.",
    coverImage: "https://images.unsplash.com/photo-1621453229864-7729f270b224?q=80&w=1200",
    status: "published",
    displayOrder: 18,
    targetClass: "10"
  },
  {
    title: "Railway & Post Office Recruitment",
    sectionType: "Entrance Exams",
    category: "Government Job",
    shortDescription: "Entry-level jobs in India's largest networks.",
    fullDescription: "Direct recruitment via marks/exam.",
    coverImage: "https://images.unsplash.com/photo-1566933293069-b55c7f326dd4?q=80&w=1200",
    status: "published",
    displayOrder: 19,
    targetClass: "10"
  },
  {
    title: "Civil Services Foundation",
    sectionType: "Entrance Exams",
    category: "Future Goals",
    shortDescription: "Start building the foundation for IAS/IPS.",
    fullDescription: "Reading habits and awareness guide.",
    coverImage: "https://images.unsplash.com/photo-1544654803-b69140b285a1?q=80&w=1200",
    status: "published",
    displayOrder: 20,
    targetClass: "10"
  },
  {
    title: "Official Resources & Portals",
    sectionType: "Resources",
    category: "Directory",
    shortDescription: "Trusted links for students.",
    fullDescription: "TN Govt and Central Govt portal hubs.",
    coverImage: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1200",
    status: "published",
    displayOrder: 21,
    targetClass: "10"
  },
  {
    title: "Decision Dashboard - Class 10 FAQ",
    sectionType: "FAQs",
    category: "Advice",
    shortDescription: "Quick answers to dilemmas.",
    fullDescription: "Expert answers for common student doubts.",
    faqs: [
      { question: "Which stream?", answer: "Interest > Marks." }
    ],
    coverImage: "https://images.unsplash.com/photo-1533073356961-7255013d2c5e?q=80&w=1200",
    status: "published",
    displayOrder: 22,
    targetClass: "10"
  }
];

const class10SeedDataWithSlugs = class10SeedData.map(item => ({
    ...item,
    slug: slugify(item.title)
}));

async function seed() {
  try {
    if (!MONGO_URI) throw new Error("No MONGO_URI in .env");
    console.log("Connecting to DB...");
    await mongoose.connect(MONGO_URI);
    console.log("Connected.");
    
    await ClassContent.deleteMany({ targetClass: { $in: ["10", "class10"] } });
    console.log("Cleared old class 10 content.");

    console.log(`Attempting to insert ${class10SeedDataWithSlugs.length} items one by one...`);
    let count = 0;
    for (const item of class10SeedDataWithSlugs) {
        try {
            await ClassContent.create(item);
            count++;
            console.log(`Inserted: ${item.title}`);
        } catch (itemError) {
            console.error(`FAILED to insert: ${item.title}`);
            console.error(itemError.message || itemError);
        }
    }
    console.log(`Done! Successfully seeded ${count} out of ${class10SeedDataWithSlugs.length} items.`);
    
    process.exit(0);
  } catch (error) {
    console.error("CRITICAL SEEDING ERROR:");
    console.error(error.message || error);
    process.exit(1);
  }
}

seed();
