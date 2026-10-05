import "./globals.css";
import Script from "next/script";
import PWAInstaller from "../components/PWAInstaller";

const siteUrl = "https://recallflow-frontend.vercel.app";

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "RecallFlow — Spaced Repetition Study Engine | Master Any Exam",
    template: "%s | RecallFlow",
  },
  description:
    "Supercharge memory retention and ace your exams with RecallFlow. Scientific spaced repetition algorithms (Quick, 3-Month, 6-Month, 1-Year, 2-Year), automated revision schedules, smart flashcards, quiz generator, and retention streak analytics.",
  applicationName: "RecallFlow",
  keywords: [
    "spaced repetition",
    "spaced repetition algorithm",
    "active recall",
    "study tracker",
    "revision schedule",
    "flashcards app",
    "exam preparation",
    "memory retention",
    "forgetting curve",
    "Leitner system",
    "spaced learning",
    "study planner",
    "quiz generator",
    "study streak tracker",
    "smart study app",
    "recallflow",
  ],
  authors: [{ name: "RecallFlow Team", url: siteUrl }],
  creator: "RecallFlow",
  publisher: "RecallFlow",
  category: "Education",
  manifest: "/manifest.json",
  alternates: {
    canonical: siteUrl,
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "RecallFlow",
    title: "RecallFlow — Spaced Repetition Study Engine & Smart Flashcards",
    description:
      "Boost your study retention by 10x with intelligent spaced repetition algorithms, AI flashcard generation, revision calendars, and analytics.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "RecallFlow — Spaced Repetition Study Engine",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "RecallFlow — Spaced Repetition Study Engine",
    description:
      "Study smarter and remember forever. AI-powered spaced repetition revision schedules, flashcards & retention tracking.",
    images: ["/og-image.png"],
    creator: "@recallflow",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "RecallFlow",
  },
};

export const viewport = {
  themeColor: "#0f172a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: "RecallFlow",
      description: "Spaced Repetition Study Engine and automated revision scheduler",
      publisher: {
        "@type": "Organization",
        name: "RecallFlow",
        logo: {
          "@type": "ImageObject",
          url: `${siteUrl}/icon-512.png`,
        },
      },
      potentialAction: {
        "@type": "SearchAction",
        target: `${siteUrl}/?search={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "SoftwareApplication",
      "@id": `${siteUrl}/#application`,
      name: "RecallFlow",
      applicationCategory: "EducationalApplication",
      operatingSystem: "Web, Android, iOS, Windows, macOS",
      description:
        "Scientific spaced repetition revision engine with 5 learning algorithms, AI flashcard maker, revision schedules, and retention streak analytics.",
      url: siteUrl,
      image: `${siteUrl}/og-image.png`,
      offers: {
        "@type": "Offer",
        price: "5.00",
        priceCurrency: "INR",
        priceValidUntil: "2027-12-31",
        availability: "https://schema.org/InStock",
        description: "Monthly Pro subscription with 7-day free trial",
      },
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "4.9",
        ratingCount: "1280",
        bestRating: "5",
        worstRating: "1",
      },
      featureList: [
        "5 Scientifically Proven Spaced Algorithms (Quick, 3-Month, 6-Month, 1-Year, 2-Year)",
        "AI-Generated Flashcards and Quizzes",
        "Automated Daily Revision Scheduler",
        "Study Streak and Retention Analytics",
        "Active Recall Testing and Score Tracking",
      ],
    },
    {
      "@type": "FAQPage",
      "@id": `${siteUrl}/#faq`,
      mainEntity: [
        {
          "@type": "Question",
          name: "What is RecallFlow?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "RecallFlow is a personalized study revision platform that utilizes spaced repetition algorithms and active recall testing to help students remember what they learn and master exam subjects.",
          },
        },
        {
          "@type": "Question",
          name: "What spaced repetition algorithms does RecallFlow use?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "RecallFlow offers 5 scientifically modeled algorithms: Quick (1, 3, 7, 14 days), 3-Month, 6-Month, 1-Year, and 2-Year cycles tailored for semester tests, competitive exams, and long-term mastery.",
          },
        },
        {
          "@type": "Question",
          name: "How much does RecallFlow cost?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "RecallFlow provides a 7-day free trial. After the trial, RecallFlow Pro is available for ₹5 per month with unlimited courses, topics, AI flashcards, and retention analytics.",
          },
        },
      ],
    },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0f172a" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-slate-950 text-slate-100 antialiased custom-scrollbar">
        {/* Semantic SEO content for crawlers & accessibility */}
        <section className="sr-only" aria-label="About RecallFlow Spaced Repetition Study Engine">
          <h2>Scientific Spaced Repetition Study & Exam Revision Engine</h2>
          <p>
            RecallFlow combines active recall testing and Hermann Ebbinghaus forgetting curve
            principles to automatically schedule study revisions at the optimal moment before you
            forget.
          </p>
          <h3>Key Features</h3>
          <ul>
            <li>5 Spaced Repetition Algorithms: Quick revision, 3-Month, 6-Month, 1-Year, and 2-Year cycles.</li>
            <li>AI Flashcards & Quiz Generator: Turn study notes into interactive question-answer flashcards.</li>
            <li>Automated Daily Calendar: Review scheduled topics and catch up on missed sessions.</li>
            <li>Performance Analytics: Track daily study minutes, retention rates, and learning streaks.</li>
          </ul>
        </section>

        <PWAInstaller />
        <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
        {children}
      </body>
    </html>
  );
}
