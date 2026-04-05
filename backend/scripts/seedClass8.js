const mongoose = require('mongoose');
const dotenv = require('dotenv');
const ClassContent = require('../models/ClassContent');

const path = require('path');
dotenv.config({ path: path.join(__dirname, '../.env') });

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/uyarvu-payanam";

const class8SeedData = [
  {
    title: "Career Guidance After 8th Standard",
    sectionType: "Basics",
    category: "Overview",
    subCategoryLabel: "Introduction, Foundation",
    shortDescription: "Class 8 is the right stage to build strong study habits, discover scholarships, improve skills, and explore future careers without pressure.",
    tags: ["class8", "career guidance", "foundation", "student growth"],
    coverImage: "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1200&auto=format&fit=crop",
    youtubeLink: "",
    externalLink: "/career-guidance/class8",
    fullDescription: "Class 8 is an important stage for students to strengthen academics, improve communication, logical thinking, and digital skills, and begin early awareness about scholarships, competitions, and careers. The goal is not to force a final decision, but to build confidence and direction for higher classes.",
    importantNote: "Students should focus on learning, exploration, and consistency. This stage is for awareness and preparation, not stress.",
    benefitType: "Awareness, Skill Building",
    scholarshipType: "General Guidance",
    eligibilityClass: "Class 8",
    eligibilityMarks: "Not mandatory",
    familyIncomeLimit: "Not applicable",
    benefitAmount: "Knowledge and preparation",
    conductedBy: "Platform Guidance",
    applicationMode: "Read and explore",
    examPattern: "Study habits, scholarship awareness, competitions, soft skills, future pathways",
    faqs: [
      {
        question: "Why is Class 8 important for career guidance?",
        answer: "Because students can start building habits, confidence, and awareness before Class 10 decisions begin."
      },
      {
        question: "Should students choose a career in Class 8?",
        answer: "No. They only need to explore interests and understand future options."
      }
    ],
    status: "published",
    featured: true,
    displayOrder: 1,
    targetClass: "8"
  },
  {
    title: "National Means-cum-Merit Scholarship Scheme (NMMS)",
    sectionType: "Exams",
    category: "Scholarship",
    subCategoryLabel: "Government, Merit, Financial Support",
    shortDescription: "A major scholarship opportunity for eligible Class 8 students from economically weaker sections.",
    tags: ["nmms", "scholarship", "government", "class8", "merit"],
    coverImage: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop",
    youtubeLink: "",
    externalLink: "https://scholarships.gov.in/",
    fullDescription: "NMMS is a central scholarship scheme for meritorious students from economically weaker sections. Eligible students in Class 8 appear for a state-level selection test. The scholarship amount is Rs. 12,000 per year, generally continuing from Class 9 to Class 12 subject to conditions.",
    importantNote: "Check your state notification, school eligibility, timeline, and renewal conditions before applying.",
    benefitType: "Cash Scholarship",
    scholarshipType: "Government",
    eligibilityClass: "Class 8",
    eligibilityMarks: "Minimum 55% in Class 7 (5% relaxation for SC/ST)",
    familyIncomeLimit: "Up to ₹3,50,000 annual parental income",
    benefitAmount: "₹12,000 per year",
    conductedBy: "Ministry of Education / State Government",
    applicationMode: "State selection process + NSP as applicable",
    examPattern: "Mental Ability Test (MAT) and Scholastic Aptitude Test (SAT)",
    faqs: [
      {
        question: "Who can apply for NMMS?",
        answer: "Eligible Class 8 students studying in government, government-aided, or local body schools, subject to scheme rules."
      },
      {
        question: "Is there an income limit?",
        answer: "Yes. Parental income should not exceed ₹3,50,000 per year."
      }
    ],
    status: "published",
    featured: true,
    displayOrder: 2,
    targetClass: "8"
  },
  {
    title: "Science Olympiads for Class 8",
    sectionType: "Exams",
    category: "Olympiad",
    subCategoryLabel: "Science, Maths, English, Cyber",
    shortDescription: "Olympiads improve reasoning, subject knowledge, confidence, and competitive exposure.",
    tags: ["olympiad", "sof", "science", "maths", "competition"],
    coverImage: "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=1200&auto=format&fit=crop",
    youtubeLink: "",
    externalLink: "https://sofworld.org/",
    fullDescription: "Class 8 students can participate in Olympiads such as Science, Maths, English, General Knowledge, and Cyber. These competitions help improve conceptual clarity, confidence, and exam readiness.",
    importantNote: "Participation often happens through school registration. Ask your school coordinator for dates and exam details.",
    benefitType: "Certificates, Medals, Recognition",
    scholarshipType: "Exam-linked Opportunity",
    eligibilityClass: "Class 8",
    eligibilityMarks: "School participation based",
    familyIncomeLimit: "Not applicable",
    benefitAmount: "Recognition, medals, certificates",
    conductedBy: "Science Olympiad Foundation / similar organizers",
    applicationMode: "Usually through school registration",
    examPattern: "Subject-based MCQs; for many SOF exams, Level 1 includes current and previous class syllabus mix",
    faqs: [
      {
        question: "Are Olympiads only for top rankers?",
        answer: "No. Any interested student can participate and improve over time."
      }
    ],
    status: "published",
    featured: false,
    displayOrder: 3,
    targetClass: "8"
  },
  {
    title: "INSPIRE Awards - MANAK",
    sectionType: "Exams",
    category: "Innovation",
    subCategoryLabel: "Science, Creativity, Problem Solving",
    shortDescription: "A science and innovation opportunity for school students to submit original ideas.",
    tags: ["inspire", "manak", "innovation", "science idea", "class8"],
    coverImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop",
    youtubeLink: "",
    externalLink: "https://www.inspireawards-dst.gov.in/",
    fullDescription: "INSPIRE-MANAK encourages original ideas and innovation among school students. It covers students in Classes 6 to 10 in the 10 to 15 age group, making it highly relevant for many Class 8 students.",
    importantNote: "School nomination is important. Students should discuss their idea with teachers and school authorities.",
    benefitType: "Recognition, Innovation Opportunity",
    scholarshipType: "Innovation Scheme",
    eligibilityClass: "Class 6 to 10",
    eligibilityMarks: "Not marks-based",
    familyIncomeLimit: "Not applicable",
    benefitAmount: "Idea recognition and further opportunity",
    conductedBy: "Department of Science and Technology",
    applicationMode: "Through school nomination / portal process",
    examPattern: "Original idea submission, science-based innovation, practical problem solving",
    faqs: [
      {
        question: "Can a Class 8 student take part in INSPIRE-MANAK?",
        answer: "Yes, Class 8 falls within the scheme’s school-level eligibility range."
      }
    ],
    status: "published",
    featured: false,
    displayOrder: 4,
    targetClass: "8"
  },
  {
    title: "Skills to Build in 8th Standard",
    sectionType: "Skills",
    category: "Life Skills",
    subCategoryLabel: "Communication, Logic, Digital, Creativity",
    shortDescription: "Build skills now that help in studies, competitions, and future career growth.",
    tags: ["skills", "communication", "logic", "digital", "creativity"],
    coverImage: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=1200&auto=format&fit=crop",
    youtubeLink: "",
    externalLink: "/career-guidance/class8#skills",
    fullDescription: "Students in Class 8 should focus on communication skills, logical thinking, digital literacy, creativity, teamwork, and reading habits. These skills help in school performance and long-term growth.",
    importantNote: "Choose one or two habits first and build consistency slowly.",
    benefitType: "Personal Development",
    scholarshipType: "Skill Building",
    eligibilityClass: "Class 8",
    eligibilityMarks: "Not applicable",
    familyIncomeLimit: "Not applicable",
    benefitAmount: "Confidence and growth",
    conductedBy: "Self-learning / school support",
    applicationMode: "Practice regularly",
    examPattern: "Speech, debate, puzzles, typing, presentations, reading, poster making",
    faqs: [
      {
        question: "Which skill is most important in Class 8?",
        answer: "Communication and logical thinking are very useful, but all core skills matter."
      }
    ],
    status: "published",
    featured: false,
    displayOrder: 5,
    targetClass: "8"
  },
  {
    title: "Fun Learning Activities for Class 8",
    sectionType: "Fun",
    category: "Activity",
    subCategoryLabel: "Quiz, Chess, Science Experiments, Reading",
    shortDescription: "Learning becomes stronger when students enjoy the process through practical and fun activities.",
    tags: ["fun learning", "quiz", "chess", "reading", "experiments"],
    coverImage: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?q=80&w=1200&auto=format&fit=crop",
    youtubeLink: "",
    externalLink: "/career-guidance/class8#activities",
    fullDescription: "Students can improve concentration, creativity, and confidence through chess, science experiments, quiz practice, poster making, storytelling, and reading biographies of inspiring people.",
    importantNote: "Balance fun activities with studies. The goal is smart learning, not distraction.",
    benefitType: "Creative and Cognitive Growth",
    scholarshipType: "Activity Guidance",
    eligibilityClass: "Class 8",
    eligibilityMarks: "Not applicable",
    familyIncomeLimit: "Not applicable",
    benefitAmount: "Better focus and confidence",
    conductedBy: "School / home / clubs",
    applicationMode: "Join and practice",
    examPattern: "Chess, quiz, project work, reading, model making, storytelling",
    faqs: [
      {
        question: "Can games really help learning?",
        answer: "Yes. Strategy games and quizzes improve memory, concentration, and reasoning."
      }
    ],
    status: "published",
    featured: false,
    displayOrder: 6,
    targetClass: "8"
  },
  {
    title: "Career Awareness After 8th Standard",
    sectionType: "Careers",
    category: "Awareness",
    subCategoryLabel: "Doctor, Engineer, Teacher, Lawyer, Scientist",
    shortDescription: "Class 8 students should begin understanding careers, not finalizing them.",
    tags: ["careers", "doctor", "engineer", "teacher", "scientist"],
    coverImage: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1200&auto=format&fit=crop",
    youtubeLink: "",
    externalLink: "/career-guidance/class8#careers",
    fullDescription: "This section introduces common future careers such as doctor, engineer, teacher, lawyer, scientist, artist, and entrepreneur. The purpose is to build awareness about subjects, interests, and pathways.",
    importantNote: "Students do not need to make a final decision now. Exposure is enough at this stage.",
    benefitType: "Future Awareness",
    scholarshipType: "Career Guidance",
    eligibilityClass: "Class 8",
    eligibilityMarks: "Not applicable",
    familyIncomeLimit: "Not applicable",
    benefitAmount: "Clarity and motivation",
    conductedBy: "Platform Guidance",
    applicationMode: "Read and explore",
    examPattern: "Career cards, subject linkage, real-world roles, curiosity building",
    faqs: [
      {
        question: "Should I pick science or commerce in Class 8?",
        answer: "No. Just learn well, observe your interests, and build basic skills."
      }
    ],
    status: "published",
    featured: false,
    displayOrder: 7,
    targetClass: "8"
  },
  {
    title: "Helpful Videos and Official Resources",
    sectionType: "Videos",
    category: "Resources",
    subCategoryLabel: "Scholarship, Learning, Practice",
    shortDescription: "Use trusted platforms and official sites for learning support and scholarship updates.",
    tags: ["resources", "diksha", "khan academy", "nsp", "official links"],
    coverImage: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?q=80&w=1200&auto=format&fit=crop",
    youtubeLink: "",
    externalLink: "/career-guidance/class8#resources",
    fullDescription: "Students can use DIKSHA for school-linked learning support, Khan Academy for concept learning, the National Scholarship Portal for scholarship-related processes, SOF for Olympiad updates, and INSPIRE-MANAK official pages for idea submission information.",
    importantNote: "Always verify dates and eligibility on official portals before taking action.",
    benefitType: "Trusted Learning Support",
    scholarshipType: "Resource Directory",
    eligibilityClass: "Class 8",
    eligibilityMarks: "Not applicable",
    familyIncomeLimit: "Not applicable",
    benefitAmount: "Learning support and verified updates",
    conductedBy: "Official portals / learning platforms",
    applicationMode: "Open links and explore",
    examPattern: "Video learning, scholarship portals, olympiad and innovation resources",
    faqs: [
      {
        question: "Why should I use official websites?",
        answer: "Because dates, eligibility, and application steps can change."
      }
    ],
    status: "published",
    featured: false,
    displayOrder: 8,
    targetClass: "8"
  },
  {
    title: "Daily Habits for Success in Class 8",
    sectionType: "Habits",
    category: "Study Habits",
    subCategoryLabel: "Routine, Revision, Reading",
    shortDescription: "Simple daily habits can make a huge difference before students enter higher classes.",
    tags: ["habits", "timetable", "revision", "reading", "consistency"],
    coverImage: "https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=1200&auto=format&fit=crop",
    youtubeLink: "",
    externalLink: "/career-guidance/class8#habits",
    fullDescription: "Students should create a simple daily timetable, revise Maths and Science regularly, maintain neat notes, improve vocabulary, and ask teachers about scholarships and competitions. Small habits become strong advantages later.",
    importantNote: "Do not overload the schedule. Consistency matters more than long hours.",
    benefitType: "Academic Improvement",
    scholarshipType: "Habit Building",
    eligibilityClass: "Class 8",
    eligibilityMarks: "Not applicable",
    familyIncomeLimit: "Not applicable",
    benefitAmount: "Better performance and discipline",
    conductedBy: "Self practice",
    applicationMode: "Follow daily",
    examPattern: "Time management, revision, note-making, reading, question practice",
    faqs: [
      {
        question: "How many hours should a Class 8 student study?",
        answer: "It depends on the student, but a steady routine with revision is more important than extreme hours."
      }
    ],
    status: "published",
    featured: false,
    displayOrder: 9,
    targetClass: "8"
  }
];

const slugify = (text) => {
  return text.toLowerCase()
    .split(" ")
    .join("-")
    .replace(/[^\w-]+/g, "") + "-" + Math.random().toString(36).substr(2, 5);
};

const class8SeedDataWithSlugs = class8SeedData.map(item => ({
    ...item,
    slug: slugify(item.title)
}));

async function seed() {
  try {
    if (!MONGO_URI) throw new Error("No MONGO_URI in .env");
    console.log("Connecting to DB...");
    await mongoose.connect(MONGO_URI);
    console.log("Connected.");
    
    const del = await ClassContent.deleteMany({ targetClass: { $in: ["8", "class8"] } });
    console.log(`Cleared ${del.deletedCount} old items.`);

    console.log(`Attempting to insert ${class8SeedDataWithSlugs.length} items one by one...`);
    let count = 0;
    for (const item of class8SeedDataWithSlugs) {
        try {
            await ClassContent.create(item);
            count++;
            console.log(`Inserted: ${item.title}`);
        } catch (itemError) {
            console.error(`FAILED to insert: ${item.title}`);
            console.error(itemError.message || itemError);
            // Don't stop the whole process, just log it.
        }
    }
    console.log(`Done! Successfully seeded ${count} out of ${class8SeedDataWithSlugs.length} items.`);
    
    process.exit(0);
  } catch (error) {
    console.error("CRITICAL SEEDING ERROR:");
    console.error(error.message || error);
    process.exit(1);
  }
}

seed();
