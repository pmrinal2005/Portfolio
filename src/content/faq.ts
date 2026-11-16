/**
 * Portfolio-aligned copy for the FAQ section (#faq), placed right after
 * the Vante project showcase and before the contact footer.
 */

export type FaqCategory = {
  id: string;
  icon: "bag" | "candles" | "target" | "trend";
  title: string;
  meta: string;
  targetQuestionId: string;
};

export type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

export const faqContent = {
  brand: "MRINAL",
  navLinks: [
    { label: "Profile", href: "#skills" },
    { label: "Projects", href: "#vante" },
    { label: "Coursework", href: "#coursework" },
    { label: "FAQs", href: "#faq" },
  ],
  language: "English",
  secondaryAction: { label: "Projects", href: "#pill-hero" },
  primaryAction: { label: "Let's Talk", href: "#contact" },
  hero: {
    tag: "FAQ",
    headline: "Frequently Asked Questions",
    ledeLine1:
      "Find answers to the most common questions about Mrinal Parida’s AI engineering,",
    ledeLine2:
      "full-stack projects, technical toolkit, academic background, and collaboration.",
    cta: { label: "Let's Collaborate", href: "#contact" },
  },
  searchPlaceholder: "Search for your queries",
  emptySearchMessage: "No questions match your search.",
  categories: [
    {
      id: "cat-ai",
      icon: "bag",
      title: "AI & Engineering Stack",
      meta: "43 Technical Skills",
      targetQuestionId: "q-solutions",
    },
    {
      id: "cat-data",
      icon: "candles",
      title: "Data Science & Analytics",
      meta: "15 AI & Data Tools",
      targetQuestionId: "q-toolkit",
    },
    {
      id: "cat-projects",
      icon: "target",
      title: "Featured Portfolio Work",
      meta: "8 Built Showcases",
      targetQuestionId: "q-projects",
    },
    {
      id: "cat-academics",
      icon: "trend",
      title: "Academics & Leadership",
      meta: "5 Core CS Courses",
      targetQuestionId: "q-background",
    },
  ] as FaqCategory[],
  questions: [
    {
      id: "q-solutions",
      question: "What AI, machine learning, and full-stack solutions does Mrinal build?",
      answer:
        "Mrinal builds and deploys production-grade AI and full-stack applications—spanning PyTorch, Scikit-Learn, NLP, and computer vision models, automated data pipelines, FastAPI and Django services, and responsive React and Next.js interfaces backed by PostgreSQL and Supabase.",
    },
    {
      id: "q-projects",
      question: "Which featured projects are showcased in this portfolio?",
      answer:
        "Highlighted builds include StillMe (an assistive voice dashboard and landing experience), LokMitra Sahayak (a civic benefit discovery platform and mission deck), COMPASS (an intelligent decision engine), SCOUTT (a business intelligence terminal for small businesses), and Bloom.",
    },
    {
      id: "q-background",
      question: "What is Mrinal Parida’s academic and leadership background?",
      answer:
        "Mrinal is a Computer Science and Data Science undergraduate with core coursework in Machine Learning, Deep Learning, Data Structures & Algorithms, Probability & Statistics, and Operating Systems, alongside leadership experience as an elected House Captain coordinating school-wide initiatives.",
    },
    {
      id: "q-toolkit",
      question: "Which programming languages, frameworks, and databases are in the toolkit?",
      answer:
        "Across 43 skills in 7 technical domains, daily tools include Python, TypeScript, JavaScript, Java, C/C++, and SQL, paired with NumPy, Pandas, Matplotlib, Seaborn, Tailwind CSS, Framer Motion, Git, Vite, PostgreSQL, MySQL Workbench, and Supabase.",
    },
    {
      id: "q-roles",
      question: "What engineering or data science roles is Mrinal currently open to?",
      answer:
        "Mrinal is actively seeking high-impact AI/ML engineering, data science, and full-stack software engineering internships or full-time opportunities, as well as ambitious product collaborations—connect directly through the contact section below.",
    },
  ] as FaqItem[],
};
