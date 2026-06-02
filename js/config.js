/* ══════════════════════════════════════════
   js/config.js
   ✏️  Edit everything in this file to
       personalise your portfolio.
══════════════════════════════════════════ */

const CONFIG ={

    github:{
        username:"fawwazmurtaza7362",
        token: "",
    },

    formspreeendpoint: "https://formspree.io/f/mwvzgonp",

    projects: [
        {
            name: "Tourist App",
            repoSlug: "tourist-app",
            pinned: true,
            status: "In Progress",
            description: "AI-powered travel planner - destination search via Gemini, hotel/attraction tabs, interactive Leaflet trip map, budget tracker, and multi-currency conversion.",
            languages: ["JavaScript", "HTML", "CSS"],
            langcolor: "#f1e05a",
            liveUrl: "https://tourist-app.vercel.app/",
            sourceUrl: "https://github.com/yourusername/tourist-app",
        },

        {
            name: "Workout rep counter",
            repoSlug: "workout-rep-counter",
            pinned: true,
            status: "In progress",
            description: "AI-powered workout rep counter using TensorFlow.js PoseNet. Real-time exercise tracking with webcam, counting reps and providing form feedback for various workouts.",
            languages: ["Python"],
            langcolor: "#3572A5",
            sourceUrl: "N/A",
        },

        {
            name: "Google calendar schedule importer",
            repoSlug: "class_schedule_to_google",
            pinned: false,
            status: "live",
            description: "Python script that imports class schedules from a university portal into Google Calendar using the Google Calendar API, automating schedule management for students.",
            languages: ["Python"],
            langcolor: "#3572A5",
        },
    ],

/* ── Skills ──────────────────────────────
     cat: 'lang' | 'frontend' | 'backend' | 'hardware' | 'ml' | 'math'
     label: 'expert' | 'advanced' | 'intermediate' | 'beginner'
     pct: 0–100
  ─────────────────────────────────────── */

  skills:[
        { name: 'Python',            pct: 92, cat: 'lang',     label: 'expert'       },
        { name: 'JavaScript',        pct: 85, cat: 'lang',     label: 'advanced'     },
        { name: 'C++',               pct: 68, cat: 'lang',     label: 'intermediate' },
        { name: 'SQL',               pct: 72, cat: 'lang',     label: 'intermediate' },
        { name: 'React',             pct: 80, cat: 'frontend', label: 'advanced'     },
        { name: 'HTML / CSS',        pct: 88, cat: 'frontend', label: 'advanced'     },
        { name: 'Leaflet.js',        pct: 74, cat: 'frontend', label: 'intermediate' },
        { name: 'Tailwind CSS',      pct: 76, cat: 'frontend', label: 'intermediate' },
        { name: 'Flask',             pct: 84, cat: 'backend',  label: 'advanced'     },
        { name: 'REST APIs',         pct: 86, cat: 'backend',  label: 'advanced'     },
        { name: 'Node.js',           pct: 65, cat: 'backend',  label: 'intermediate' },
        { name: 'Git / GitHub',      pct: 90, cat: 'backend',  label: 'expert'       },
        { name: 'Raspberry Pi',      pct: 88, cat: 'hardware', label: 'advanced'     },
        { name: 'Linux / systemd',   pct: 80, cat: 'hardware', label: 'advanced'     },
        { name: 'OpenCV',            pct: 85, cat: 'ml',       label: 'advanced'     },
        { name: 'Gemini AI API',     pct: 78, cat: 'ml',       label: 'intermediate' },
        { name: 'scipy / numpy',     pct: 82, cat: 'math',     label: 'advanced'     },
        { name: 'Numerical Methods', pct: 79, cat: 'math',     label: 'intermediate' },
        { name: 'Linear Algebra',    pct: 76, cat: 'math',     label: 'intermediate' },
  ],
};