import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../supabaseClient";
import Modal from "../components/Modal";
import { TECH_ICON, TECH_COLOR } from "../components/techIcons";
import FacultyBadge from "../components/FacultyBadge";

const UW_MAJORS = [
  "Accounting",
  "African American Studies",
  "African Cultural Studies",
  "Agricultural and Applied Economics",
  "Agricultural Business Management",
  "Agroecology",
  "Agronomy",
  "Animal and Veterinary Biosciences",
  "Animal Sciences",
  "Anthropology",
  "Applied Mathematics, Engineering, and Physics (AMEP)",
  "Applied Social Science",
  "Art",
  "Art Education",
  "Art History",
  "Asian Languages and Cultures",
  "Astronomy–Physics",
  "Atmospheric and Oceanic Sciences",
  "Biochemistry",
  "Biological Systems Engineering",
  "Biology",
  "Biomedical Engineering",
  "Botany",
  "Business: Accounting",
  "Business: Actuarial Science",
  "Business: Entrepreneurship",
  "Business: Finance, Investment, and Banking",
  "Business: Human Resource Management",
  "Business: Information Systems",
  "Business: International Business",
  "Business: Management",
  "Business: Management and Human Resources",
  "Business: Marketing",
  "Business: Operations and Technology Management",
  "Business: Real Estate and Urban Land Economics",
  "Business: Risk Management and Insurance",
  "Business: Supply Chain Management",
  "Cartography and Geographic Information Systems",
  "Chemical Engineering",
  "Chemistry",
  "Chicanx/e and Latinx/e Studies",
  "Chinese",
  "Civil Engineering",
  "Classical Humanities",
  "Classics",
  "Communication Arts",
  "Communication Sciences and Disorders",
  "Community and Environmental Sociology",
  "Community and Organizational Development",
  "Computer Engineering",
  "Computer Sciences",
  "Conservation Biology",
  "Consumer Behavior and Marketplace Studies",
  "Consumer Finance and Financial Planning",
  "Dairy and Food Animal Management",
  "Dairy Science",
  "Dance",
  "Data Science",
  "Design, Innovation, and Society",
  "Economics",
  "Educational Policy Studies",
  "Electrical Engineering",
  "Elementary Education",
  "Elementary Education and Special Education",
  "Engineering Mechanics",
  "Engineering Physics",
  "English",
  "Entomology",
  "Environmental Engineering",
  "Environmental Sciences",
  "Environmental Studies",
  "Food Science",
  "Forest Science",
  "French",
  "Gender and Women's Studies",
  "Genetics and Genomics",
  "Geography",
  "Geological Engineering",
  "Geology and Geophysics",
  "German",
  "Global Health",
  "Health Promotion and Health Equity",
  "History",
  "Horticulture",
  "Human Development and Family Studies",
  "Individual Major",
  "Industrial Engineering",
  "Information Science",
  "Interior Architecture",
  "International Studies",
  "Italian",
  "Japanese",
  "Jewish Studies",
  "Journalism",
  "Kinesiology",
  "Korean Language and Culture",
  "Landscape and Urban Studies",
  "Landscape Architecture",
  "Latin",
  "Latin American, Caribbean, and Iberian Studies",
  "Legal Studies",
  "Life Sciences Communication",
  "Linguistics",
  "Materials Science and Engineering",
  "Mathematics",
  "Mechanical Engineering",
  "Microbiology",
  "Molecular and Cell Biology",
  "Music",
  "Music: Education",
  "Music: Performance",
  "Naval Science",
  "Neurobiology",
  "Nuclear Engineering",
  "Nursing",
  "Nutritional Sciences",
  "Personal Finance",
  "Pharmaceutical Sciences",
  "Pharmacology and Toxicology",
  "Philosophy",
  "Physical Education",
  "Physics",
  "Plant Pathology",
  "Plant Science and Technology",
  "Polish",
  "Political Science",
  "Portuguese",
  "Psychology",
  "Public Policy",
  "Rehabilitation Psychology",
  "Religious Studies",
  "Russian",
  "Scandinavian Studies",
  "Social Welfare",
  "Social Work",
  "Sociology",
  "Soil Science",
  "Spanish",
  "Special Education",
  "Statistics",
  "Textiles and Fashion Design",
  "Theatre and Drama",
  "Wildlife Ecology",
  "Zoology",
];

const SKILL_OPTIONS = [
    // Frontend
    'JavaScript', 'TypeScript', 'React', 'Vue', 'Next.js', 'Angular', 'Svelte', 'Tailwind CSS',
    // Backend
    'Node.js', 'Express.js', 'Java', 'Spring', 'Python', 'Django', 'Flask', 'FastAPI', 'Ruby', 'Ruby on Rails', 'PHP', 'Laravel', 'C++', 'C#', 'Go', 'Rust', 'Scala',
    // ML / AI
    'TensorFlow', 'PyTorch', 'Pandas',
    // Database
    'SQL', 'MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'GraphQL', 'Firebase', 'Elasticsearch',
    // DevOps / Cloud
    'AWS', 'Docker', 'Kubernetes', 'Git', 'Linux', 'Terraform',
    // Mobile
    'Swift', 'Kotlin', 'Flutter', 'React Native',
    // Design / Game
    'Figma', 'UI/UX', 'Unity', 'Unreal Engine',
];
const INTEREST_OPTIONS = ['AI', 'ML', 'Data Science', 'Web', 'Security', 'IoT'];

const UW_COURSES = [
  // Core CS
  "CS 220: Data Science Programming I",
  "CS 240: Introduction to Discrete Mathematics",
  "CS 252: Introduction to Computer Engineering",
  "CS 300: Programming II",
  "CS 301: Data Structures",
  "CS 302: Introduction to Programming",
  "CS 310: Foundations of Computing",
  "CS 320: Data Models & Languages",
  "CS 354: Machine Organization & Programming",
  "CS 368: Learning a New Programming Language",
  "CS 400: Programming III",
  "CS 407: The Science of Computing",
  "CS 412: Introduction to Numerical Methods",
  "CS 435: Introduction to Cryptography",
  "CS 475: Introduction to Combinatorics",
  "CS 484: Introduction to Computer Vision",
  "CS 502: Theory and Practice in CS Education",
  "CS 506: Software Engineering",
  "CS 513: Introduction to Formal Systems",
  "CS 514: Optimization",
  "CS 516: Introduction to Database Systems",
  "CS 520: Introduction to AI",
  "CS 524: Introduction to Optimization",
  "CS 525: Linear Programming Methods",
  "CS 526: Information Theory",
  "CS 532: Matrix Methods in Machine Learning",
  "CS 534: Machine Learning",
  "CS 536: Introduction to Programming Languages",
  "CS 537: Introduction to Operating Systems",
  "CS 538: Introduction to the Theory of Computing",
  "CS 540: Introduction to Artificial Intelligence",
  "CS 541: Machine Learning",
  "CS 542: Introduction to Log-Linear Models",
  "CS 544: Introduction to Big Data Systems",
  "CS 545: Deep Learning",
  "CS 547: Natural Language Processing",
  "CS 552: Computer Architecture",
  "CS 558: Introduction to Computer Security",
  "CS 559: Computer Graphics",
  "CS 560: Foundations of Information Retrieval",
  "CS 564: Database Management Systems",
  "CS 570: Introduction to Human-Computer Interaction",
  "CS 571: Building User Interfaces",
  "CS 576: Introduction to Bioinformatics",
  "CS 577: Introduction to Algorithms",
  "CS 579: Computer Vision",
  "CS 630: Algorithms",
  "CS 640: Introduction to Computer Networks",
  "CS 642: Computer Security",
  "CS 701: Construction of Compilers",
  "CS 702: Advanced Algorithms",
  "CS 703: Advanced Topics in Compilers",
  "CS 704: Principles of Programming Languages",
  "CS 706: Concurrent Computing",
  "CS 707: Machine Learning",
  "CS 710: Complexity Theory",
  "CS 712: Distributed Computing",
  "CS 717: Foundations of Programming Languages",
  "CS 726: Nonlinear Optimization",
  "CS 730: Advanced AI",
  "CS 731: Advanced NLP",
  "CS 732: Advanced Computer Vision",
  "CS 736: Advanced Operating Systems",
  "CS 737: Fault-Tolerant Computing",
  "CS 739: Distributed Systems",
  "CS 740: Advanced Computer Networks",
  "CS 744: Big Data Systems",
  "CS 746: Advanced Topics in Networking",
  "CS 752: Advanced Computer Architecture",
  "CS 754: Advanced Computer Architecture II",
  "CS 756: Performance Evaluation",
  "CS 757: Parallel Processing",
  "CS 758: Advanced Computer Architecture III",
  "CS 760: Machine Learning",
  "CS 761: Modern Robotics",
  "CS 766: Computer Vision",
  "CS 769: Advanced NLP",
  "CS 771: Human-Computer Interaction",
  "CS 776: Deep Reinforcement Learning",
  "CS 779: Computer Graphics",
  "CS 781: Computer Vision for Medical Imaging",
  "CS 784: Foundations of Data Management",
  "CS 787: Advanced Algorithms",
  // Data Science
  "DS 100: Foundations of Data Science",
  "DS 200: Data Programming",
  "DS 300: Data Warehousing",
  "DS 400: Machine Learning for DS",
  "DS 500: Data Science Capstone",
  // Stats (common for CS/DS)
  "STAT 240: Data Science Modeling I",
  "STAT 301: Introduction to Statistical Methods",
  "STAT 302: Accelerated Introduction to Statistical Methods",
  "STAT 324: Introductory Statistics for Engineers",
  "STAT 340: Data Science Modeling II",
  "STAT 371: Introductory Applied Statistics for Life Sciences",
  "STAT 424: Analysis of Experiments",
  "STAT 431: Applied Analysis of Variance",
  "STAT 451: Introduction to Machine Learning and Statistical Pattern Classification",
  "STAT 453: Introduction to Deep Learning and Generative Models",
  "STAT 456: Statistical Machine Learning",
  "STAT 471: Introduction to Linear Models",
  "STAT 479: Special Topics in Statistics",
  // Math (common prereqs)
  "MATH 221: Calculus and Analytic Geometry 1",
  "MATH 222: Calculus and Analytic Geometry 2",
  "MATH 234: Calculus—Functions of Several Variables",
  "MATH 240: Introduction to Discrete Mathematics",
  "MATH 320: Linear Algebra and Differential Equations",
  "MATH 340: Elementary Matrix and Linear Algebra",
  "MATH 341: Linear Algebra",
  "MATH 375: Topics in Multi-Variable Calculus and Linear Algebra",
  "MATH 421: Theory of Single Variable Calculus",
  "MATH 425: Introduction to Combinatorics",
  "MATH 431: Introduction to the Theory of Probability",
  "MATH 521: Analysis I",
  "MATH 541: Modern Algebra",
];

// 🚨 기존 친구 CSS의 맨 밑에 "모달과 폼 전용 CSS"를 추가했습니다!
const style = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Syne:wght@700;800&display=swap');

  *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

  :root {
    --red: #E14141;
    --red-light: #FFF0F0;
    --bg: #F4F2EF;
    --card: #FFFFFF;
    --text: #111111;
    --muted: #999990;
    --border: #E8E5E0;
    --sidebar-w: 64px;
  }

  body { background: var(--bg); font-family: 'DM Sans', sans-serif; color: var(--text); }

  .pp-root { margin-left: var(--sidebar-w); min-height: 100vh; background: var(--bg); font-family: 'DM Sans', sans-serif; color: var(--text); }

  @keyframes rise { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }

.pp-banner { height: 160px; background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 40%, #1f1f1f 100%); position: relative; overflow: hidden; margin-left: calc(-1 * var(--sidebar-w)); padding-left: var(--sidebar-w); }
  .pp-banner-accent { position: absolute; bottom: -40px; right: -40px; width: 220px; height: 220px; border-radius: 50%; background: radial-gradient(circle, rgba(225,65,65,0.18) 0%, transparent 70%); }
  .pp-header { padding: 0 48px; position: relative; }
  .pp-avatar-wrap { position: relative; display: inline-block; margin-top: -44px; margin-bottom: 16px; animation: rise 0.5s cubic-bezier(0.22,1,0.36,1) both; }
  .pp-avatar { width: 88px; height: 88px; border-radius: 50%; border: 4px solid var(--bg); background: linear-gradient(135deg, #E14141, #ff8c8c); display: flex; align-items: center; justify-content: center; font-family: 'Syne', sans-serif; font-size: 28px; font-weight: 700; color: #fff; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.12); }
  .pp-avatar img { width: 100%; height: 100%; object-fit: cover; }
  .pp-identity { animation: rise 0.5s 0.05s cubic-bezier(0.22,1,0.36,1) both; }
  .pp-name { font-family: 'Syne', sans-serif; font-size: 32px; font-weight: 700; letter-spacing: -0.02em; line-height: 1; }
  .pp-email { font-size: 13px; font-weight: 300; color: var(--muted); margin-top: 4px; }
  .pp-major { font-size: 12px; font-weight: 500; color: var(--red); margin-top: 5px; letter-spacing: 0.02em; }
  .pp-actions { display: flex; gap: 8px; margin-top: 16px; flex-wrap: wrap; animation: rise 0.5s 0.1s cubic-bezier(0.22,1,0.36,1) both; }
  .pp-btn { display: flex; align-items: center; gap: 6px; padding: 8px 18px; border-radius: 100px; font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 500; cursor: pointer; transition: all 0.18s; text-decoration: none; }
  .pp-btn svg { width: 13px; height: 13px; stroke: currentColor; fill: none; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
  .pp-btn-outline { border: 1.5px solid var(--border); background: var(--card); color: var(--muted); }
  .pp-btn-outline:hover { border-color: #bbb; color: var(--text); }
  .pp-btn-red { border: none; background: var(--red); color: #fff; box-shadow: 0 2px 10px rgba(225,65,65,0.28); }
  .pp-btn-red:hover { background: #d03232; transform: translateY(-1px); box-shadow: 0 4px 16px rgba(225,65,65,0.36); }
  .pp-divider { height: 1px; background: var(--border); margin: 24px 48px 0; }
  .pp-body { display: grid; grid-template-columns: 260px minmax(0, 720px); gap: 24px; padding: 24px 48px 80px; max-width: 1100px; width: 100%; }
  .pp-sidebar { display: flex; flex-direction: column; gap: 16px; }
  .pp-card { background: var(--card); border: 1px solid var(--border); border-radius: 18px; overflow: hidden; box-shadow: 0 2px 12px rgba(0,0,0,0.04); animation: rise 0.5s cubic-bezier(0.22,1,0.36,1) both; }
  .pp-card-header { padding: 16px 20px 12px; border-bottom: 1px solid var(--border); display: flex; align-items: center; gap: 8px; }
  .pp-card-title { font-family: 'Syne', sans-serif; font-size: 13px; font-weight: 700; letter-spacing: -0.01em; }
  .pp-card-edit-btn { margin-left: auto; display: flex; align-items: center; justify-content: center; width: 26px; height: 26px; border-radius: 8px; border: 1.5px solid var(--border); background: none; cursor: pointer; color: var(--muted); transition: all 0.18s; flex-shrink: 0; }
  .pp-card-edit-btn:hover { border-color: var(--text); color: var(--text); background: var(--bg); }
  .pp-card-edit-btn svg { width: 12px; height: 12px; stroke: currentColor; fill: none; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
  .pp-bio-inline { font-size: 12px; font-weight: 300; color: var(--muted); margin-top: 8px; max-width: 480px; line-height: 1.65; }
  .pp-shared-courses { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 10px; }
  .pp-shared-badge { display: inline-flex; align-items: center; gap: 5px; font-size: 11px; font-weight: 600; padding: 4px 10px; border-radius: 8px; background: #EEF4FF; color: #3B6FE0; border: 1.5px solid #C3D5F8; }
  .pp-shared-badge svg { width: 11px; height: 11px; stroke: #3B6FE0; fill: none; stroke-width: 2.5; stroke-linecap: round; }
  .pp-course-chip { display: inline-flex; align-items: center; font-size: 11px; font-weight: 500; padding: 4px 10px; border-radius: 8px; background: var(--bg); border: 1.5px solid var(--border); color: var(--text); }
  .pp-course-chip.shared { background: #EEF4FF; border-color: #C3D5F8; color: #3B6FE0; }
  .pp-card-body { padding: 16px 20px; }
  .pp-stats { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
  .pp-stat { background: var(--bg); border-radius: 12px; padding: 12px 14px; border: 1px solid var(--border); }
  .pp-stat-num { font-family: 'Syne', sans-serif; font-size: 22px; font-weight: 700; line-height: 1; }
  .pp-stat-label { font-size: 10px; font-weight: 500; color: var(--muted); text-transform: uppercase; letter-spacing: 0.06em; margin-top: 4px; }
  .pp-tech-grid { display: flex; flex-wrap: wrap; gap: 7px; }
  .pp-tech-chip { display: flex; align-items: center; gap: 6px; padding: 5px 11px; border-radius: 9px; border: 1.5px solid var(--border); background: var(--bg); font-size: 11px; font-weight: 500; transition: border-color 0.18s; }
  .pp-tech-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
  .pp-empty-tech { font-size: 12px; color: var(--muted); font-weight: 300; }
  .pp-main { display: flex; flex-direction: column; gap: 16px; }
  .pp-proj-list { display: flex; flex-direction: column; gap: 10px; }
  .pp-proj-card { background: var(--card); border: 1px solid var(--border); border-radius: 16px; padding: 18px 20px; display: flex; align-items: center; gap: 16px; text-decoration: none; color: inherit; transition: box-shadow 0.2s, border-color 0.2s, transform 0.2s; animation: rise 0.45s cubic-bezier(0.22,1,0.36,1) both; }
  .pp-proj-card:hover { box-shadow: 0 6px 24px rgba(0,0,0,0.08); border-color: #d8d4ce; transform: translateY(-2px); }
  .pp-proj-card:hover .pp-proj-title { color: var(--red); }
  .pp-proj-img { width: 56px; height: 56px; border-radius: 12px; flex-shrink: 0; background: linear-gradient(135deg, #f0ede9, #e8e4df); overflow: hidden; border: 1px solid var(--border); display: flex; align-items: center; justify-content: center; }
  .pp-proj-img img { width: 100%; height: 100%; object-fit: cover; }
  .pp-proj-img svg { width: 20px; height: 20px; stroke: #ccc; fill: none; stroke-width: 1.5; }
  .pp-proj-info { flex: 1; min-width: 0; }
  .pp-proj-title { font-family: 'Syne', sans-serif; font-size: 19px; font-weight: 700; letter-spacing: -0.01em; transition: color 0.18s; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .pp-proj-desc { font-size: 12px; font-weight: 300; color: var(--muted); line-height: 1.5; margin-top: 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .pp-proj-tags { display: flex; gap: 5px; margin-top: 8px; flex-wrap: wrap; }
  .pp-proj-tag { font-size: 10px; font-weight: 500; letter-spacing: 0.05em; text-transform: uppercase; padding: 3px 9px; border-radius: 100px; border: 1.5px solid transparent; }
  .tag-ai   { background: #FFF0F0; color: #E14141; border-color: #F5C6C6; }
  .tag-data { background: #EEF4FF; color: #3B6FE0; border-color: #C3D5F8; }
  .tag-ml   { background: #F0FFF4; color: #2E8B57; border-color: #B2DFC0; }
  .tag-web  { background: #FFF8EE; color: #E07B20; border-color: #F5D9B0; }
  .tag-sec  { background: #F5F0FF; color: #7B3FE4; border-color: #D4B8F8; }
  .tag-iot  { background: #F0F9FF; color: #0284C7; border-color: #BAE6FD; }
  .tag-default { background: #f3f4f6; color: #4b5563; border-color: #e5e7eb; }
  .pp-empty { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 48px 0; gap: 10px; color: var(--muted); font-size: 13px; font-weight: 300; background: var(--card); border: 1px solid var(--border); border-radius: 18px; }
  .pp-empty svg { width: 32px; height: 32px; stroke: #ddd; fill: none; stroke-width: 1.5; }
  .pp-loading { display: flex; align-items: center; justify-content: center; padding: 80px 0; color: var(--muted); font-size: 13px; }
  .pp-show-more { width: 100%; margin-top: 8px; padding: 9px; border: none; background: none; border-top: 1px solid var(--border); color: var(--muted); font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 500; cursor: pointer; transition: color 0.18s; text-align: center; }
  .pp-show-more:hover { color: var(--text); }

  /* ── Tabs ───────────────────────────────────── */
  .pp-tabs { display: flex; gap: 4px; padding: 0 0 16px; border-bottom: 1.5px solid var(--border); margin-bottom: 16px; flex-wrap: wrap; }
  .pp-tab {
    padding: 7px 16px; border-radius: 100px;
    border: 1.5px solid transparent; background: none;
    font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 600;
    letter-spacing: 0.03em; color: var(--muted); cursor: pointer;
    transition: all 0.18s; display: flex; align-items: center; gap: 6px;
    white-space: nowrap;
  }
  .pp-tab:hover { color: var(--text); background: var(--bg); border-color: var(--border); }
  .pp-tab.active { background: var(--text); color: #fff; border-color: var(--text); }
  .pp-tab-count {
    font-size: 10px; font-weight: 700; padding: 1px 6px; border-radius: 100px;
    background: rgba(255,255,255,0.25);
  }
  .pp-tab:not(.active) .pp-tab-count { background: var(--border); color: var(--muted); }

  /* ── Sidebar extras ─────────────────────────── */
  .pp-links-card-row { display: flex; align-items: center; gap: 10px; padding: 6px 0; border-bottom: 1px solid var(--border); }
  .pp-links-card-row:last-child { border-bottom: none; }
  .pp-links-card-row svg { width: 14px; height: 14px; stroke: var(--muted); fill: none; stroke-width: 1.8; stroke-linecap: round; flex-shrink: 0; }
  .pp-links-card-row a { font-size: 12px; font-weight: 500; color: var(--text); text-decoration: none; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .pp-links-card-row a:hover { color: var(--red); text-decoration: underline; text-underline-offset: 2px; }

  /* ── Job row in profile ─────────────────────── */
  .pp-job-row {
    display: flex; align-items: center; gap: 12px;
    padding: 10px 12px; border-radius: 12px;
    border: 1px solid var(--border); background: var(--bg);
    text-decoration: none; color: inherit;
    transition: border-color 0.18s, box-shadow 0.18s;
    cursor: pointer;
  }
  .pp-job-row:hover { border-color: #d0ccc8; box-shadow: 0 2px 10px rgba(0,0,0,0.05); }
  .pp-job-logo {
    width: 38px; height: 38px; border-radius: 9px; flex-shrink: 0;
    background: var(--card); border: 1px solid var(--border);
    display: flex; align-items: center; justify-content: center;
    font-family: 'Syne', sans-serif; font-size: 14px; font-weight: 700;
    color: var(--red); overflow: hidden;
  }
  .pp-job-logo img { width: 100%; height: 100%; object-fit: contain; }
  .pp-job-info { flex: 1; min-width: 0; }
  .pp-job-title { font-family: 'Syne', sans-serif; font-size: 13px; font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .pp-job-company { font-size: 11px; color: var(--muted); margin-top: 2px; }
  .pp-job-badges { display: flex; gap: 4px; flex-wrap: wrap; margin-top: 5px; }

  /* ── Two-col tab content ────────────────────── */
  .pp-tab-two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .pp-tab-section-title { font-size: 10px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: var(--muted); margin-bottom: 10px; }
  @media (max-width: 900px) { .pp-tab-two-col { grid-template-columns: 1fr; } }

  /* 🚨🚨 완벽 방어! 100% 뜨는 모달창 & 폼 강제 CSS 🚨🚨 */
  .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.6); backdrop-filter: blur(4px); z-index: 99999; display: flex; align-items: center; justify-content: center; }
  .modal-box { background: #fff; width: 100%; max-width: 500px; max-height: 90vh; border-radius: 20px; display: flex; flex-direction: column; box-shadow: 0 10px 40px rgba(0,0,0,0.3); animation: rise 0.3s cubic-bezier(0.22,1,0.36,1) forwards; }
  .modal-header { padding: 20px 24px; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; background: var(--bg); border-radius: 20px 20px 0 0; }
  .modal-title { font-family: 'Syne', sans-serif; font-size: 20px; font-weight: 700; color: var(--text); }
  .modal-close { background: none; border: none; font-size: 32px; color: var(--muted); cursor: pointer; line-height: 1; transition: color 0.2s; }
  .modal-close:hover { color: var(--red); }
  .modal-body { padding: 24px; overflow-y: auto; font-family: 'DM Sans', sans-serif; }
  
  .form-group { margin-bottom: 24px; }
  .form-label { display: block; font-size: 14px; font-weight: 700; margin-bottom: 10px; color: var(--text); }
  .form-input { width: 100%; padding: 12px 16px; border: 1px solid #ccc; border-radius: 10px; font-family: inherit; font-size: 14px; transition: border-color 0.2s; }
  .form-input:focus { outline: none; border-color: var(--red); box-shadow: 0 0 0 3px var(--red-light); }
  .tag-container { display: flex; flex-wrap: wrap; gap: 8px; }
  .tag-btn { padding: 8px 14px; border-radius: 100px; border: 1px solid #ddd; background: #f9f9f9; font-size: 12px; font-weight: 600; cursor: pointer; transition: 0.2s; color: #555; }
  .tag-btn:hover { border-color: #bbb; }
  .tag-btn.active-skill { background: var(--text); color: #fff; border-color: var(--text); }
  .tag-btn.active-interest { background: var(--red); color: #fff; border-color: var(--red); }
  
  .modal-footer { display: flex; justify-content: flex-end; gap: 12px; margin-top: 32px; padding-top: 20px; border-top: 1px solid var(--border); }
  .btn-cancel { padding: 12px 24px; border: 1px solid #ccc; border-radius: 10px; background: #fff; cursor: pointer; font-weight: 700; color: #555; transition: background 0.2s; }
  .btn-cancel:hover { background: #f5f5f5; }
  .btn-save { padding: 12px 24px; border: none; border-radius: 10px; background: var(--red); color: #fff; cursor: pointer; font-weight: 700; transition: background 0.2s, transform 0.1s; }
  .btn-save:hover { background: #c93636; }
  .btn-save:disabled { opacity: 0.6; cursor: not-allowed; }

  /* ── Major dropdown ─────────────────────────── */
  .major-dropdown { position: relative; width: 100%; }
  .major-trigger { width: 100%; padding: 12px 16px; border: 1px solid #ccc; border-radius: 10px; font-family: inherit; font-size: 14px; background: #fff; cursor: pointer; display: flex; align-items: center; justify-content: space-between; transition: border-color 0.2s; text-align: left; color: var(--text); }
  .major-trigger:focus { outline: none; border-color: var(--red); box-shadow: 0 0 0 3px var(--red-light); }
  .major-trigger.placeholder { color: #aaa; }
  .major-trigger svg { width: 14px; height: 14px; stroke: var(--muted); fill: none; stroke-width: 2.5; flex-shrink: 0; transition: transform 0.2s; }
  .major-trigger.open svg { transform: rotate(180deg); }
  .major-panel { position: absolute; top: calc(100% + 6px); left: 0; right: 0; background: #fff; border: 1px solid #ddd; border-radius: 12px; box-shadow: 0 8px 32px rgba(0,0,0,0.12); z-index: 9999; overflow: hidden; animation: rise 0.15s cubic-bezier(0.22,1,0.36,1) both; }
  .major-search-wrap { padding: 10px 12px; border-bottom: 1px solid var(--border); }
  .major-search { width: 100%; padding: 8px 12px; border: 1px solid #ddd; border-radius: 8px; font-family: inherit; font-size: 13px; outline: none; }
  .major-search:focus { border-color: var(--red); }
  .major-list { max-height: 220px; overflow-y: auto; }
  .major-option { padding: 9px 16px; font-size: 13px; cursor: pointer; transition: background 0.12s; display: flex; align-items: center; justify-content: space-between; }
  .major-option:hover { background: var(--bg); }
  .major-option.selected { background: var(--red-light); color: var(--red); font-weight: 600; }
  .major-option-check { width: 14px; height: 14px; stroke: var(--red); fill: none; stroke-width: 2.5; }
  .major-empty { padding: 16px; text-align: center; font-size: 13px; color: var(--muted); }
`;



function normalizeList(raw) {
  if (Array.isArray(raw) && raw.length > 0) return raw;
  if (typeof raw === "string") {
    const parsed = raw.split(",").map((v) => v.trim()).filter(Boolean);
    return parsed.length > 0 ? parsed : [];
  }
  return [];
}

export default function ProfilePage() {
  const { id } = useParams();
  const routeKey = id ?? "me";

  const [profile, setProfile] = useState(null);
  const [isMyProfile, setIsMyProfile] = useState(false);
  const [projects, setProjects] = useState([]);
  const [applications, setApplications] = useState([]);
  const [savedProjects, setSavedProjects] = useState([]);
  const [friends, setFriends] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  // null=no relation, 'pending_sent', 'pending_received', 'accepted'
  const [friendshipStatus, setFriendshipStatus] = useState(null);
  const [friendshipId, setFriendshipId] = useState(null);
  const [authUserId, setAuthUserId] = useState(null);
  const [confirmUnfriend, setConfirmUnfriend] = useState(false);
  const [expanded, setExpanded] = useState({});
  const LIMIT = 4;
  const toggle = (key) => setExpanded(prev => ({ ...prev, [key]: !prev[key] }));

  useEffect(() => {
    const handler = (e) => {
      if (majorDropdownRef.current && !majorDropdownRef.current.contains(e.target)) {
        setMajorDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);
  const [loading, setLoading] = useState(true);

  const [savedJobs, setSavedJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [activeTab, setActiveTab] = useState("posts");

  const [editSection, setEditSection] = useState(null); // 'identity' | 'interests' | 'skills' | 'links'
  const [saving, setSaving] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [editLinkedin, setEditLinkedin] = useState("");
  const [editGithub, setEditGithub] = useState("");
  const [editMajor, setEditMajor] = useState("");
  const [editBio, setEditBio] = useState("");
  const [editCourses, setEditCourses] = useState([]);
  const [courseSearch, setCourseSearch] = useState("");
  const [myCourses, setMyCourses] = useState([]);
  const [majorDropdownOpen, setMajorDropdownOpen] = useState(false);
  const [majorSearch, setMajorSearch] = useState("");
  const majorDropdownRef = useRef(null);

  useEffect(() => {
    let active = true;

    async function load() {
      setLoading(true);
      const { data: authData } = await supabase.auth.getUser();
      const authUserId = authData?.user?.id;
      setAuthUserId(authUserId);

      let profileRow = null;

      if (routeKey === "me" && authUserId) {
        const { data } = await supabase.from("profiles").select("*").eq("id", authUserId).maybeSingle();
        profileRow = data;
      } else {
        const { data } = await supabase.from("profiles").select("*").ilike("school_email", `${routeKey}@%`).maybeSingle();
        profileRow = data;
      }

      if (profileRow && active) {
        setProfile(profileRow);
        setIsMyProfile(authUserId === profileRow.id);
        
        setSelectedSkills(normalizeList(profileRow.technical_skills));
        setSelectedTags(normalizeList(profileRow.interest_tags));
        setEditLinkedin(profileRow.linkedin_url || "");
        setEditGithub(profileRow.github_url || "");
        setEditMajor(profileRow.major || "");
        setEditBio(profileRow.bio || "");
        setEditCourses(normalizeList(profileRow.current_courses));

        // Fetch my own courses when viewing someone else's profile
        if (authUserId && authUserId !== profileRow.id) {
          const { data: myData } = await supabase
            .from("profiles").select("current_courses").eq("id", authUserId).maybeSingle();
          if (myData) setMyCourses(normalizeList(myData.current_courses));
        }

        const { data: postsData } = await supabase
          .from("projects")
          .select("*")
          .eq("author_id", profileRow.id)
          .order("created_at", { ascending: false });
        setProjects(postsData || []);

        const { data: appsData } = await supabase
          .from("applications")
          .select(`
            id, created_at, status, message,
            project_roles ( role_name, projects ( id, title, content, category_tag, images ) )
          `)
          .eq("applicant_id", profileRow.id)
          .order("created_at", { ascending: false });
        
        const formattedApps = (appsData || []).map(app => {
          const roleData = Array.isArray(app.project_roles) ? app.project_roles[0] : app.project_roles;
          const projectData = Array.isArray(roleData?.projects) ? roleData.projects[0] : roleData?.projects;
          return {
            appId: app.id,
            status: app.status,
            role_name: roleData?.role_name,
            ...projectData
          };
        });
        setApplications(formattedApps);

        const { data: savedData } = await supabase
          .from('saved_projects')
          .select(`created_at, projects ( id, title, content, category_tag, images )`)
          .eq('user_id', profileRow.id)
          .order('created_at', { ascending: false });

        setSavedProjects((savedData || []).map(s => {
          const p = Array.isArray(s.projects) ? s.projects[0] : s.projects;
          return { ...p, savedAt: s.created_at };
        }).filter(Boolean));

        const { data: savedJobsData } = await supabase
          .from('saved_jobs')
          .select('created_at, jobs ( id, title, company, company_logo, job_type, is_paid, opt_cpt_eligible, us_citizenship_required, is_remote, location, posted_at )')
          .eq('user_id', profileRow.id)
          .order('created_at', { ascending: false });
        setSavedJobs((savedJobsData || []).map(s => {
          const j = Array.isArray(s.jobs) ? s.jobs[0] : s.jobs;
          return j ? { ...j, savedAt: s.created_at } : null;
        }).filter(Boolean));

        const { data: appliedJobsData } = await supabase
          .from('job_applications')
          .select('created_at, jobs ( id, title, company, company_logo, job_type, is_paid, opt_cpt_eligible, us_citizenship_required, is_remote, location, posted_at )')
          .eq('user_id', profileRow.id)
          .order('created_at', { ascending: false });
        setAppliedJobs((appliedJobsData || []).map(a => {
          const j = Array.isArray(a.jobs) ? a.jobs[0] : a.jobs;
          return j ? { ...j, appliedAt: a.created_at } : null;
        }).filter(Boolean));

        // Fetch accepted friends list for this profile
        const { data: friendsData } = await supabase
          .from('friendships')
          .select('id, requester_id, addressee_id, requester:requester_id(id, school_email), addressee:addressee_id(id, school_email)')
          .or(`requester_id.eq.${profileRow.id},addressee_id.eq.${profileRow.id}`)
          .eq('status', 'accepted');

        setFriends((friendsData || []).map(f => {
          const friend = f.requester_id === profileRow.id
            ? (Array.isArray(f.addressee) ? f.addressee[0] : f.addressee)
            : (Array.isArray(f.requester) ? f.requester[0] : f.requester);
          return friend;
        }).filter(Boolean));

        // Fetch incoming pending requests (only relevant on own profile)
        if (authUserId === profileRow.id) {
          const { data: reqData } = await supabase
            .from('friendships')
            .select('id, requester:requester_id(id, school_email)')
            .eq('addressee_id', profileRow.id)
            .eq('status', 'pending');
          setPendingRequests((reqData || []).map(r => ({
            id: r.id,
            requester: Array.isArray(r.requester) ? r.requester[0] : r.requester,
          })).filter(r => r.requester));
        }

        // If viewing someone else's profile, check friendship status between me and them
        if (authUserId && authUserId !== profileRow.id) {
          const { data: fs } = await supabase
            .from('friendships')
            .select('id, status, requester_id')
            .or(`and(requester_id.eq.${authUserId},addressee_id.eq.${profileRow.id}),and(requester_id.eq.${profileRow.id},addressee_id.eq.${authUserId})`)
            .maybeSingle();

          if (fs) {
            setFriendshipId(fs.id);
            if (fs.status === 'accepted') setFriendshipStatus('accepted');
            else if (fs.requester_id === authUserId) setFriendshipStatus('pending_sent');
            else setFriendshipStatus('pending_received');
          }
        }
      }
      setLoading(false);
    }
    load();
    return () => { active = false; };
  }, [routeKey]);

  const handleAddFriend = async () => {
    if (!authUserId) return;
    const { data, error } = await supabase.from('friendships')
      .insert({ requester_id: authUserId, addressee_id: profile.id })
      .select('id').single();
    if (!error && data) { setFriendshipId(data.id); setFriendshipStatus('pending_sent'); }
  };

  const handleAcceptFriend = async () => {
    if (!friendshipId) return;
    await supabase.from('friendships').update({ status: 'accepted' }).eq('id', friendshipId);
    setFriendshipStatus('accepted');
    const friend = { id: profile.id, school_email: profile.school_email };
    setFriends(prev => [...prev, friend]);
  };

  const handleAcceptRequest = async (requestId, requester) => {
    await supabase.from('friendships').update({ status: 'accepted' }).eq('id', requestId);
    setPendingRequests(prev => prev.filter(r => r.id !== requestId));
    setFriends(prev => [...prev, requester]);
  };

  const handleDeclineRequest = async (requestId) => {
    await supabase.from('friendships').delete().eq('id', requestId);
    setPendingRequests(prev => prev.filter(r => r.id !== requestId));
  };

  const handleRemoveFriend = async () => {
    if (!friendshipId) return;
    await supabase.from('friendships').delete().eq('id', friendshipId);
    setFriendshipStatus(null);
    setFriendshipId(null);
    setConfirmUnfriend(false);
    setFriends(prev => prev.filter(f => f.id !== profile.id));
  };

  const toggleArrayItem = (item, array, setArray) => {
    if (array.includes(item)) setArray(array.filter(i => i !== item));
    else setArray([...array, item]);
  };

  // 🚨 더욱 강력해진 모달 저장 버튼 로직 (에러 추적 및 완벽 업데이트)
  const handleEditSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    if (!profile?.id) { setSaving(false); return; }

    const payloads = {
      identity: { major: editMajor, bio: editBio },
      interests: { interest_tags: selectedTags.join(", ") },
      skills:    { technical_skills: selectedSkills.join(", ") },
      links:     { linkedin_url: editLinkedin, github_url: editGithub },
      courses:   { current_courses: editCourses.join(", ") },
    };
    const payload = payloads[editSection] || {};

    try {
      const { data, error: updateError } = await supabase
        .from("profiles").update(payload).eq("id", profile.id).select();
      if (updateError) {
        console.error(updateError);
      } else if (data?.length > 0) {
        setProfile(prev => ({ ...prev, ...payload }));
        setEditSection(null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="pp-loading"><style>{style}</style>Loading...</div>;
  if (!profile) return <div className="pp-loading"><style>{style}</style>User not found.</div>;

  const initials = profile.school_email.slice(0, 2).toUpperCase();
  const displayName = profile.school_email.split("@")[0];
  const avatarUrl = profile.avatar_url;

  return (
    <div className="pp-root">
      <style>{style}</style>

      {/* Banner */}
      <div className="pp-banner">
        <div className="pp-banner-accent" />
      </div>

      {/* Header */}
      <div className="pp-header">
        <div className="pp-avatar-wrap">
          <div className="pp-avatar">
            {avatarUrl ? <img src={avatarUrl} alt={displayName} /> : initials}
          </div>
        </div>

        <div className="pp-identity">
          <div className="pp-name" style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              {displayName}
              {isMyProfile && (
                <button className="pp-card-edit-btn" onClick={() => setEditSection("identity")} style={{ width: 24, height: 24, borderRadius: 7, flexShrink: 0 }}>
                  <svg viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                </button>
              )}
            </span>
            {profile.is_professor && (
              <FacultyBadge label={profile.professor_title || "Faculty"} style={{ fontSize: 11, padding: "3px 9px 3px 7px" }} />
            )}
          </div>
          <div className="pp-email">{profile.school_email}</div>
          {profile.major && <div className="pp-major">{profile.major}</div>}
          {profile.bio && <div className="pp-bio-inline">{profile.bio}</div>}
          {!isMyProfile && myCourses.length > 0 && (() => {
            const profileCourses = normalizeList(profile.current_courses);
            const shared = myCourses.filter(c => profileCourses.includes(c));
            if (shared.length === 0) return null;
            return (
              <div className="pp-shared-courses">
                {shared.map(c => (
                  <span key={c} className="pp-shared-badge">
                    <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
                    Taking {c.split(":")[0]}
                  </span>
                ))}
              </div>
            );
          })()}
        </div>

        <div className="pp-actions">
          {!isMyProfile && authUserId && (
            friendshipStatus === 'accepted' ? (
              confirmUnfriend ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 12, color: 'var(--muted)', whiteSpace: 'nowrap' }}>Remove friend?</span>
                  <button className="pp-btn" onClick={handleRemoveFriend} style={{ background: 'var(--red)', color: '#fff', border: 'none', padding: '6px 14px' }}>Yes</button>
                  <button className="pp-btn pp-btn-outline" onClick={() => setConfirmUnfriend(false)} style={{ padding: '6px 14px' }}>Cancel</button>
                </div>
              ) : (
                <button className="pp-btn pp-btn-outline" onClick={() => setConfirmUnfriend(true)} style={{ color: '#2E8B57', borderColor: '#B2DFC0' }}>
                  <svg viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  Friends
                </button>
              )
            ) : friendshipStatus === 'pending_sent' ? (
              <button className="pp-btn pp-btn-outline" onClick={handleRemoveFriend} style={{ color: '#E14141', borderColor: '#F5C6C6' }}>
                <svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                Cancel Request
              </button>
            ) : friendshipStatus === 'pending_received' ? (
              <button className="pp-btn pp-btn-red" onClick={handleAcceptFriend}>
                <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
                Accept Request
              </button>
            ) : (
              <button className="pp-btn pp-btn-red" onClick={handleAddFriend}>
                <svg viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                Add Friend
              </button>
            )
          )}
        </div>
      </div>

      <div className="pp-divider" />

      {/* Body */}
      <div className="pp-body">

        {/* ── Sidebar ─────────────────────────────── */}
        <div className="pp-sidebar">
          {/* Overview */}
          <div className="pp-card" style={{ animationDelay: "0.05s" }}>
            <div className="pp-card-header">
              <svg style={{width:14,height:14,stroke:"var(--muted)",fill:"none",strokeWidth:2,strokeLinecap:"round"}} viewBox="0 0 24 24"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
              <span className="pp-card-title">Overview</span>
            </div>
            <div className="pp-card-body">
              <div className="pp-stats">
                <div className="pp-stat">
                  <div className="pp-stat-num">{projects.length}</div>
                  <div className="pp-stat-label">Projects</div>
                </div>
                <div className="pp-stat">
                  <div className="pp-stat-num">{friends.length}</div>
                  <div className="pp-stat-label">Friends</div>
                </div>
                <div className="pp-stat">
                  <div className="pp-stat-num">{applications.length + appliedJobs.length}</div>
                  <div className="pp-stat-label">Applied</div>
                </div>
                <div className="pp-stat">
                  <div className="pp-stat-num">{savedProjects.length + savedJobs.length}</div>
                  <div className="pp-stat-label">Saved</div>
                </div>
              </div>
            </div>
          </div>

          {/* Interests */}
          {(selectedTags.length > 0 || isMyProfile) && (
            <div className="pp-card" style={{ animationDelay: "0.08s" }}>
              <div className="pp-card-header">
                <svg style={{width:14,height:14,stroke:"var(--muted)",fill:"none",strokeWidth:2,strokeLinecap:"round"}} viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
                <span className="pp-card-title">Interests</span>
                {isMyProfile && <button className="pp-card-edit-btn" type="button" onClick={() => setEditSection("interests")}><svg viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></button>}
              </div>
              <div className="pp-card-body">
                <div className="pp-tech-grid">
                  {selectedTags.map(tag => (
                    <div key={tag} className="pp-tech-chip" style={{ fontSize: 10, padding: "3px 9px" }}>{tag}</div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tech Stack */}
          <div className="pp-card" style={{ animationDelay: "0.1s" }}>
            <div className="pp-card-header">
              <svg style={{width:14,height:14,stroke:"var(--muted)",fill:"none",strokeWidth:2,strokeLinecap:"round"}} viewBox="0 0 24 24"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
              <span className="pp-card-title">Tech Stack</span>
              {isMyProfile && <button className="pp-card-edit-btn" type="button" onClick={() => setEditSection("skills")}><svg viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></button>}
            </div>
            <div className="pp-card-body">
              {selectedSkills.length > 0 ? (
                <div className="pp-tech-grid">
                  {selectedSkills.map(name => {
                    const Icon = TECH_ICON[name];
                    const color = TECH_COLOR[name] ?? "#E14141";
                    return (
                      <div key={name} className="pp-tech-chip" style={{ display: "inline-flex", alignItems: "center", gap: "5px" }}>
                        {Icon ? <Icon size={13} color={color} /> : <span className="pp-tech-dot" style={{ background: color }} />}
                        {name}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="pp-empty-tech">No technologies selected.</p>
              )}
            </div>
          </div>

          {/* Links */}
          {(profile.github_url || profile.linkedin_url || isMyProfile) && (
            <div className="pp-card" style={{ animationDelay: "0.12s" }}>
              <div className="pp-card-header">
                <svg style={{width:14,height:14,stroke:"var(--muted)",fill:"none",strokeWidth:2,strokeLinecap:"round"}} viewBox="0 0 24 24"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>
                <span className="pp-card-title">Links</span>
                {isMyProfile && <button className="pp-card-edit-btn" type="button" onClick={() => setEditSection("links")}><svg viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></button>}
              </div>
              <div className="pp-card-body">
                {profile.github_url && (
                  <div className="pp-links-card-row">
                    <svg viewBox="0 0 24 24"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22"/></svg>
                    <a href={profile.github_url} target="_blank" rel="noopener noreferrer">{profile.github_url.replace(/^https?:\/\/(www\.)?/, "")}</a>
                  </div>
                )}
                {profile.linkedin_url && (
                  <div className="pp-links-card-row">
                    <svg viewBox="0 0 24 24"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
                    <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer">{profile.linkedin_url.replace(/^https?:\/\/(www\.)?/, "")}</a>
                  </div>
                )}
              </div>
            </div>
          )}
          {/* Current Courses */}
          {(normalizeList(profile.current_courses).length > 0 || isMyProfile) && (
            <div className="pp-card" style={{ animationDelay: "0.14s" }}>
              <div className="pp-card-header">
                <svg style={{width:14,height:14,stroke:"var(--muted)",fill:"none",strokeWidth:2,strokeLinecap:"round"}} viewBox="0 0 24 24"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
                <span className="pp-card-title">Current Courses</span>
                {isMyProfile && <button className="pp-card-edit-btn" type="button" onClick={() => setEditSection("courses")}><svg viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></button>}
              </div>
              <div className="pp-card-body">
                {normalizeList(profile.current_courses).length > 0 ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                    {normalizeList(profile.current_courses).map(c => {
                      const isShared = !isMyProfile && myCourses.includes(c);
                      return (
                        <span key={c} className={`pp-course-chip${isShared ? " shared" : ""}`}>
                          {isShared && <svg style={{width:10,height:10,stroke:"#3B6FE0",fill:"none",strokeWidth:2.5,strokeLinecap:"round",marginRight:4}} viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>}
                          {c.split(":")[0]}: {c.split(":")[1]?.trim()}
                        </span>
                      );
                    })}
                  </div>
                ) : (
                  <p className="pp-empty-tech">No courses added yet.</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ── Main with Tabs ───────────────────────── */}
        <div className="pp-main">
          {/* Tab bar */}
          <div className="pp-tabs">
            {[
              { key: "posts",        label: "Posts",        count: projects.length,                         icon: <svg style={{width:12,height:12,stroke:"currentColor",fill:"none",strokeWidth:2,strokeLinecap:"round"}} viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg> },
              { key: "applications", label: "Applications", count: applications.length + appliedJobs.length, icon: <svg style={{width:12,height:12,stroke:"currentColor",fill:"none",strokeWidth:2,strokeLinecap:"round"}} viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> },
              { key: "saved",        label: "Saved",        count: savedProjects.length + savedJobs.length, icon: <svg style={{width:12,height:12,stroke:"currentColor",fill:"none",strokeWidth:2,strokeLinecap:"round"}} viewBox="0 0 24 24"><path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/></svg> },
              { key: "social",       label: "Social",       count: friends.length + (isMyProfile ? pendingRequests.length : 0), icon: <svg style={{width:12,height:12,stroke:"currentColor",fill:"none",strokeWidth:2,strokeLinecap:"round"}} viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg> },
            ].map(tab => (
              <button
                key={tab.key}
                className={`pp-tab${activeTab === tab.key ? " active" : ""}`}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.icon}
                {tab.label}
                {tab.count > 0 && <span className="pp-tab-count">{tab.count}</span>}
              </button>
            ))}
          </div>

          {/* ── Posts tab ───── */}
          {activeTab === "posts" && (
            <div className="pp-card">
              <div className="pp-card-body" style={{ padding: "12px 16px" }}>
                {projects.length === 0 ? (
                  <div className="pp-empty"><span>No projects posted yet.</span></div>
                ) : (
                  <div className="pp-proj-list">
                    {(expanded.projects ? projects : projects.slice(0, LIMIT)).map((p, i) => (
                      <a key={p.id} href={`/project/${p.id}`} className="pp-proj-card" style={{ animationDelay: `${0.05 + i * 0.04}s` }}>
                        <div className="pp-proj-img">
                          {(p.images ?? [])[0] ? <img src={p.images[0]} alt={p.title} /> : <svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>}
                        </div>
                        <div className="pp-proj-info">
                          <div className="pp-proj-title">{p.title}</div>
                          {p.content && <div className="pp-proj-desc">{p.content}</div>}
                        </div>
                        <div className="pp-proj-arrow"><svg viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></div>
                      </a>
                    ))}
                  </div>
                )}
                {projects.length > LIMIT && (
                  <button className="pp-show-more" onClick={() => toggle('projects')}>
                    {expanded.projects ? 'Show less ↑' : `Show ${projects.length - LIMIT} more ↓`}
                  </button>
                )}
              </div>
            </div>
          )}

          {/* ── Applications tab ── */}
          {activeTab === "applications" && (
            <div className="pp-tab-two-col">
              {/* Job applications */}
              <div className="pp-card">
                <div className="pp-card-header">
                  <svg style={{width:14,height:14,stroke:"var(--muted)",fill:"none",strokeWidth:2,strokeLinecap:"round"}} viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/></svg>
                  <span className="pp-card-title">Jobs Applied</span>
                  <span style={{ marginLeft: "auto", fontSize: 11, color: "var(--muted)", fontWeight: 500 }}>{appliedJobs.length}</span>
                </div>
                <div className="pp-card-body" style={{ padding: "12px 16px" }}>
                  {appliedJobs.length === 0 ? (
                    <div className="pp-empty"><span>No jobs applied yet.</span></div>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {(expanded.appliedJobs ? appliedJobs : appliedJobs.slice(0, LIMIT)).map(job => (
                        <a key={job.id} href="/jobs" className="pp-job-row">
                          <div className="pp-job-logo">
                            {job.company_logo ? <img src={job.company_logo} alt={job.company} /> : job.company.charAt(0).toUpperCase()}
                          </div>
                          <div className="pp-job-info">
                            <div className="pp-job-title">{job.title}</div>
                            <div className="pp-job-company">{job.company}</div>
                            <div className="pp-job-badges">
                              <span style={{ fontSize: 10, fontWeight: 600, padding: "2px 6px", borderRadius: 5, background: "#EEF4FF", color: "#3B6FE0", border: "1px solid #C3D5F8" }}>{job.job_type}</span>
                              <span style={{ fontSize: 10, fontWeight: 600, padding: "2px 6px", borderRadius: 5, background: "#F0FFF4", color: "#2E8B57", border: "1px solid #B2DFC0" }}>✓ Applied</span>
                            </div>
                          </div>
                        </a>
                      ))}
                    </div>
                  )}
                  {appliedJobs.length > LIMIT && (
                    <button className="pp-show-more" onClick={() => toggle('appliedJobs')}>
                      {expanded.appliedJobs ? 'Show less ↑' : `Show ${appliedJobs.length - LIMIT} more ↓`}
                    </button>
                  )}
                </div>
              </div>

              {/* Project applications */}
              <div className="pp-card">
                <div className="pp-card-header">
                  <svg style={{width:14,height:14,stroke:"var(--muted)",fill:"none",strokeWidth:2,strokeLinecap:"round"}} viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="14" rx="2"/></svg>
                  <span className="pp-card-title">Project Roles</span>
                  <span style={{ marginLeft: "auto", fontSize: 11, color: "var(--muted)", fontWeight: 500 }}>{applications.length}</span>
                </div>
                <div className="pp-card-body" style={{ padding: "12px 16px" }}>
                  {applications.length === 0 ? (
                    <div className="pp-empty"><span>No applications yet.</span></div>
                  ) : (
                    <div className="pp-proj-list">
                      {(expanded.applications ? applications : applications.slice(0, LIMIT)).map((app, i) => (
                        <a key={app.appId} href={`/project/${app.id}`} className="pp-proj-card" style={{ animationDelay: `${0.05 + i * 0.04}s` }}>
                          <div className="pp-proj-img">
                            {(app.images ?? [])[0] ? <img src={app.images[0]} alt={app.title} /> : <svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>}
                          </div>
                          <div className="pp-proj-info">
                            <div className="pp-proj-title">{app.title}</div>
                            <div className="pp-proj-desc">{app.role_name}</div>
                            <div className="pp-proj-tags">
                              <span className={`pp-proj-tag ${app.status === 'pending' ? 'tag-data' : app.status === 'accepted' ? 'tag-ml' : 'tag-ai'}`}>{app.status}</span>
                            </div>
                          </div>
                        </a>
                      ))}
                    </div>
                  )}
                  {applications.length > LIMIT && (
                    <button className="pp-show-more" onClick={() => toggle('applications')}>
                      {expanded.applications ? 'Show less ↑' : `Show ${applications.length - LIMIT} more ↓`}
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ── Saved tab ──── */}
          {activeTab === "saved" && (
            <div className="pp-tab-two-col">
              {/* Saved jobs */}
              <div className="pp-card">
                <div className="pp-card-header">
                  <svg style={{width:14,height:14,stroke:"var(--muted)",fill:"none",strokeWidth:2,strokeLinecap:"round"}} viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/></svg>
                  <span className="pp-card-title">Saved Jobs</span>
                  <span style={{ marginLeft: "auto", fontSize: 11, color: "var(--muted)", fontWeight: 500 }}>{savedJobs.length}</span>
                </div>
                <div className="pp-card-body" style={{ padding: "12px 16px" }}>
                  {savedJobs.length === 0 ? (
                    <div className="pp-empty"><span>No saved jobs.</span></div>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {(expanded.savedJobs ? savedJobs : savedJobs.slice(0, LIMIT)).map(job => (
                        <a key={job.id} href="/jobs" className="pp-job-row">
                          <div className="pp-job-logo">
                            {job.company_logo ? <img src={job.company_logo} alt={job.company} /> : job.company.charAt(0).toUpperCase()}
                          </div>
                          <div className="pp-job-info">
                            <div className="pp-job-title">{job.title}</div>
                            <div className="pp-job-company">{job.company} · {job.is_remote ? "Remote" : job.location}</div>
                            <div className="pp-job-badges">
                              <span style={{ fontSize: 10, fontWeight: 600, padding: "2px 6px", borderRadius: 5, background: "#EEF4FF", color: "#3B6FE0", border: "1px solid #C3D5F8" }}>{job.job_type}</span>
                              {job.is_paid
                                ? <span style={{ fontSize: 10, fontWeight: 600, padding: "2px 6px", borderRadius: 5, background: "#F0FFF4", color: "#2E8B57", border: "1px solid #B2DFC0" }}>Paid</span>
                                : <span style={{ fontSize: 10, fontWeight: 600, padding: "2px 6px", borderRadius: 5, background: "#FFF8EE", color: "#E07B20", border: "1px solid #F5D9B0" }}>Unpaid</span>
                              }
                              {job.opt_cpt_eligible && <span style={{ fontSize: 10, fontWeight: 600, padding: "2px 6px", borderRadius: 5, background: "#F0F9FF", color: "#0284C7", border: "1px solid #BAE6FD" }}>OPT/CPT</span>}
                            </div>
                          </div>
                        </a>
                      ))}
                    </div>
                  )}
                  {savedJobs.length > LIMIT && (
                    <button className="pp-show-more" onClick={() => toggle('savedJobs')}>
                      {expanded.savedJobs ? 'Show less ↑' : `Show ${savedJobs.length - LIMIT} more ↓`}
                    </button>
                  )}
                </div>
              </div>

              {/* Saved projects */}
              <div className="pp-card">
                <div className="pp-card-header">
                  <svg style={{width:14,height:14,stroke:"var(--muted)",fill:"none",strokeWidth:2,strokeLinecap:"round"}} viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="14" rx="2"/></svg>
                  <span className="pp-card-title">Saved Projects</span>
                  <span style={{ marginLeft: "auto", fontSize: 11, color: "var(--muted)", fontWeight: 500 }}>{savedProjects.length}</span>
                </div>
                <div className="pp-card-body" style={{ padding: "12px 16px" }}>
                  {savedProjects.length === 0 ? (
                    <div className="pp-empty"><span>No saved projects.</span></div>
                  ) : (
                    <div className="pp-proj-list">
                      {(expanded.saved ? savedProjects : savedProjects.slice(0, LIMIT)).map((p, i) => (
                        <a key={p.id} href={`/project/${p.id}`} className="pp-proj-card" style={{ animationDelay: `${0.05 + i * 0.04}s` }}>
                          <div className="pp-proj-img">
                            {(p.images ?? [])[0] ? <img src={p.images[0]} alt={p.title} /> : <svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>}
                          </div>
                          <div className="pp-proj-info">
                            <div className="pp-proj-title">{p.title}</div>
                            {p.content && <div className="pp-proj-desc">{p.content}</div>}
                          </div>
                          <div className="pp-proj-arrow"><svg viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></div>
                        </a>
                      ))}
                    </div>
                  )}
                  {savedProjects.length > LIMIT && (
                    <button className="pp-show-more" onClick={() => toggle('saved')}>
                      {expanded.saved ? 'Show less ↑' : `Show ${savedProjects.length - LIMIT} more ↓`}
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ── Social tab ── */}
          {activeTab === "social" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {isMyProfile && (
                <div className="pp-card">
                  <div className="pp-card-header">
                    <svg style={{width:14,height:14,stroke:"var(--muted)",fill:"none",strokeWidth:2,strokeLinecap:"round"}} viewBox="0 0 24 24"><path d="M18 8h1a4 4 0 010 8h-1"/><path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>
                    <span className="pp-card-title">Friend Requests</span>
                    {pendingRequests.length > 0 && <span style={{ marginLeft: 6, background: "var(--red)", color: "#fff", fontSize: 10, fontWeight: 700, borderRadius: 100, padding: "1px 7px" }}>{pendingRequests.length}</span>}
                  </div>
                  <div className="pp-card-body" style={{ padding: "12px 16px" }}>
                    {pendingRequests.length === 0 ? (
                      <div className="pp-empty"><span>No pending requests.</span></div>
                    ) : (
                      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        {(expanded.requests ? pendingRequests : pendingRequests.slice(0, LIMIT)).map(req => {
                          const name = req.requester.school_email?.split('@')[0] || 'Unknown';
                          return (
                            <div key={req.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", borderRadius: 12, border: "1px solid var(--border)", background: "var(--bg)" }}>
                              <a href={`/profile/${name}`} style={{ display: "flex", alignItems: "center", gap: 10, flex: 1, textDecoration: "none", color: "inherit" }}>
                                <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg, #E14141, #ff8c8c)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#fff", flexShrink: 0 }}>{name.charAt(0).toUpperCase()}</div>
                                <div>
                                  <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, fontWeight: 700 }}>{name}</div>
                                  <div style={{ fontSize: 11, color: "var(--muted)", fontWeight: 300 }}>{req.requester.school_email}</div>
                                </div>
                              </a>
                              <button onClick={() => handleAcceptRequest(req.id, req.requester)} style={{ padding: "6px 14px", borderRadius: 100, border: "none", background: "var(--red)", color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" }}>Accept</button>
                              <button onClick={() => handleDeclineRequest(req.id)} style={{ padding: "6px 14px", borderRadius: 100, border: "1.5px solid var(--border)", background: "none", color: "var(--muted)", fontSize: 12, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" }}>Decline</button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                    {pendingRequests.length > LIMIT && <button className="pp-show-more" onClick={() => toggle('requests')}>{expanded.requests ? 'Show less ↑' : `Show ${pendingRequests.length - LIMIT} more ↓`}</button>}
                  </div>
                </div>
              )}

              <div className="pp-card">
                <div className="pp-card-header">
                  <svg style={{width:14,height:14,stroke:"var(--muted)",fill:"none",strokeWidth:2,strokeLinecap:"round"}} viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>
                  <span className="pp-card-title">Friends</span>
                  <span style={{ marginLeft: "auto", fontSize: 11, color: "var(--muted)", fontWeight: 500 }}>{friends.length}</span>
                </div>
                <div className="pp-card-body" style={{ padding: "12px 16px" }}>
                  {friends.length === 0 ? (
                    <div className="pp-empty"><span>No friends yet.</span></div>
                  ) : (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(110px, 1fr))", gap: 8 }}>
                      {(expanded.friends ? friends : friends.slice(0, 8)).map(f => {
                        const name = f.school_email?.split('@')[0] || 'Unknown';
                        return (
                          <a key={f.id} href={`/profile/${name}`} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, padding: "14px 10px", borderRadius: 12, border: "1px solid var(--border)", background: "var(--bg)", textDecoration: "none", color: "inherit", transition: "box-shadow 0.18s, border-color 0.18s", textAlign: "center" }}
                            onMouseEnter={e => { e.currentTarget.style.borderColor = "#d8d4ce"; e.currentTarget.style.boxShadow = "0 2px 10px rgba(0,0,0,0.06)"; }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.boxShadow = "none"; }}>
                            <div style={{ width: 44, height: 44, borderRadius: "50%", background: "linear-gradient(135deg, #E14141, #ff8c8c)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 700, color: "#fff" }}>{name.charAt(0).toUpperCase()}</div>
                            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 12, fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", width: "100%" }}>{name}</div>
                          </a>
                        );
                      })}
                    </div>
                  )}
                  {friends.length > 8 && <button className="pp-show-more" onClick={() => toggle('friends')}>{expanded.friends ? 'Show less ↑' : `Show ${friends.length - 8} more ↓`}</button>}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Section modals */}
      <Modal isOpen={editSection === "identity"} onClose={() => setEditSection(null)} title="Edit Profile">
        <form onSubmit={handleEditSave}>
          <div className="form-group">
            <span className="form-label">Major</span>
            <div className="major-dropdown" ref={majorDropdownRef}>
              <button type="button" className={`major-trigger${editMajor ? "" : " placeholder"}${majorDropdownOpen ? " open" : ""}`} onClick={() => { setMajorDropdownOpen(o => !o); setMajorSearch(""); }}>
                <span>{editMajor || "Select your major..."}</span>
                <svg viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>
              </button>
              {majorDropdownOpen && (
                <div className="major-panel">
                  <div className="major-search-wrap">
                    <input autoFocus type="text" className="major-search" placeholder="Search majors..." value={majorSearch} onChange={e => setMajorSearch(e.target.value)} />
                  </div>
                  <div className="major-list">
                    {UW_MAJORS.filter(m => m.toLowerCase().includes(majorSearch.toLowerCase())).length === 0
                      ? <div className="major-empty">No majors found.</div>
                      : UW_MAJORS.filter(m => m.toLowerCase().includes(majorSearch.toLowerCase())).map(m => (
                          <div key={m} className={`major-option${editMajor === m ? " selected" : ""}`} onClick={() => { setEditMajor(m); setMajorDropdownOpen(false); setMajorSearch(""); }}>
                            {m}
                            {editMajor === m && <svg className="major-option-check" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>}
                          </div>
                        ))
                    }
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="form-group">
            <span className="form-label">About <span style={{ fontWeight: 300, color: "var(--muted)", fontSize: 12 }}>(~100 words)</span></span>
            <textarea value={editBio} onChange={(e) => setEditBio(e.target.value)} placeholder="Write a short description about yourself..." className="form-input" rows={4} style={{ resize: "vertical" }} />
            <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 4, textAlign: "right" }}>{editBio.trim().split(/\s+/).filter(Boolean).length} / 100 words</div>
          </div>
          <div className="modal-footer">
            <button type="button" onClick={() => setEditSection(null)} className="btn-cancel">Cancel</button>
            <button type="submit" disabled={saving} className="btn-save">{saving ? "Saving..." : "Save"}</button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={editSection === "interests"} onClose={() => setEditSection(null)} title="Edit Interests">
        <form onSubmit={handleEditSave}>
          <div className="form-group">
            <div className="tag-container">
              {INTEREST_OPTIONS.map(tag => (
                <button key={tag} type="button" onClick={() => toggleArrayItem(tag, selectedTags, setSelectedTags)} className={`tag-btn ${selectedTags.includes(tag) ? 'active-interest' : ''}`}>{tag}</button>
              ))}
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" onClick={() => setEditSection(null)} className="btn-cancel">Cancel</button>
            <button type="submit" disabled={saving} className="btn-save">{saving ? "Saving..." : "Save"}</button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={editSection === "skills"} onClose={() => setEditSection(null)} title="Edit Tech Stack">
        <form onSubmit={handleEditSave}>
          <div className="form-group">
            <div className="tag-container">
              {SKILL_OPTIONS.map(skill => {
                const Icon = TECH_ICON[skill];
                return (
                  <button key={skill} type="button" onClick={() => toggleArrayItem(skill, selectedSkills, setSelectedSkills)} className={`tag-btn ${selectedSkills.includes(skill) ? 'active-skill' : ''}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                    {Icon && <Icon size={13} color={selectedSkills.includes(skill) ? "#fff" : (TECH_COLOR[skill] ?? "#999")} />}
                    {skill}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" onClick={() => setEditSection(null)} className="btn-cancel">Cancel</button>
            <button type="submit" disabled={saving} className="btn-save">{saving ? "Saving..." : "Save"}</button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={editSection === "courses"} onClose={() => setEditSection(null)} title="Current Courses">
        <form onSubmit={handleEditSave}>
          <div className="form-group">
            <input
              type="text"
              className="form-input"
              placeholder="Search courses (e.g. CS 540, STAT 451…)"
              value={courseSearch}
              onChange={e => setCourseSearch(e.target.value)}
              style={{ marginBottom: 10 }}
            />
            <div style={{ maxHeight: 240, overflowY: "auto", display: "flex", flexDirection: "column", gap: 4 }}>
              {UW_COURSES.filter(c => c.toLowerCase().includes(courseSearch.toLowerCase())).map(c => {
                const selected = editCourses.includes(c);
                return (
                  <button
                    key={c} type="button"
                    onClick={() => setEditCourses(prev => selected ? prev.filter(x => x !== c) : [...prev, c])}
                    style={{
                      textAlign: "left", padding: "8px 12px", borderRadius: 9,
                      border: `1.5px solid ${selected ? "#3B6FE0" : "var(--border)"}`,
                      background: selected ? "#EEF4FF" : "var(--bg)",
                      color: selected ? "#3B6FE0" : "var(--text)",
                      fontFamily: "inherit", fontSize: 12, fontWeight: selected ? 600 : 400,
                      cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between",
                    }}
                  >
                    {c}
                    {selected && <svg style={{width:12,height:12,stroke:"#3B6FE0",fill:"none",strokeWidth:2.5,strokeLinecap:"round",flexShrink:0}} viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>}
                  </button>
                );
              })}
            </div>
            {editCourses.length > 0 && (
              <p style={{ fontSize: 11, color: "var(--muted)", marginTop: 8 }}>{editCourses.length} course{editCourses.length > 1 ? "s" : ""} selected</p>
            )}
          </div>
          <div className="modal-footer">
            <button type="button" onClick={() => setEditSection(null)} className="btn-cancel">Cancel</button>
            <button type="submit" disabled={saving} className="btn-save">{saving ? "Saving..." : "Save"}</button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={editSection === "links"} onClose={() => setEditSection(null)} title="Edit Links">
        <form onSubmit={handleEditSave}>
          <div className="form-group">
            <span className="form-label">LinkedIn URL</span>
            <input type="url" value={editLinkedin} onChange={(e) => setEditLinkedin(e.target.value)} placeholder="https://linkedin.com/in/..." className="form-input" />
          </div>
          <div className="form-group">
            <span className="form-label">GitHub URL</span>
            <input type="url" value={editGithub} onChange={(e) => setEditGithub(e.target.value)} placeholder="https://github.com/..." className="form-input" />
          </div>
          <div className="modal-footer">
            <button type="button" onClick={() => setEditSection(null)} className="btn-cancel">Cancel</button>
            <button type="submit" disabled={saving} className="btn-save">{saving ? "Saving..." : "Save"}</button>
          </div>
        </form>
      </Modal>

    </div>
  );
}