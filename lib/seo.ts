import type { Metadata } from "next";
import {
  EVENTBRITE_URL,
  SEE_FOREVER_URL,
  SEO_OG_IMAGE,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL
} from "@/lib/constants";
import type { SessionRecord } from "@/lib/types";
import { displaySessionTitle, formatDateLabel, formatTimeRange, labelForCategory } from "@/lib/utils";

const ogImage = {
  url: SEO_OG_IMAGE,
  width: 1200,
  height: 630,
  alt: `${SITE_NAME} convening`
};

export const siteMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: SITE_NAME,
  title: {
    default: `${SITE_NAME} | National Convening in Washington, D.C.`,
    template: `%s | ${SITE_NAME}`
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} | National Convening in Washington, D.C.`,
    description: SITE_DESCRIPTION,
    images: [ogImage]
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} | National Convening in Washington, D.C.`,
    description: SITE_DESCRIPTION,
    images: [SEO_OG_IMAGE]
  }
};

export function buildMetadata({
  title,
  description,
  path = "/",
  image = SEO_OG_IMAGE,
  noIndex = false
}: {
  title: string;
  description: string;
  path?: string;
  image?: string;
  noIndex?: boolean;
}): Metadata {
  const absoluteUrl = new URL(path, SITE_URL).toString();
  const resolvedImage = {
    url: image,
    width: 1200,
    height: 630,
    alt: title
  };

  return {
    title,
    description,
    alternates: {
      canonical: absoluteUrl
    },
    openGraph: {
      type: "website",
      url: absoluteUrl,
      siteName: SITE_NAME,
      title,
      description,
      images: [resolvedImage]
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image]
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
          nocache: true,
          googleBot: {
            index: false,
            follow: false,
            noimageindex: true
          }
        }
      : {
          index: true,
          follow: true
        }
  };
}

export function getEventStructuredData() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        name: SITE_NAME,
        url: SITE_URL,
        description: SITE_DESCRIPTION
      },
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: "See Forever Foundation and Maya Angelou Schools",
        url: SEE_FOREVER_URL,
        description:
          "Scholar-centered education, advocacy, and opportunity-building work that grounds From Silos to Solutions.",
        sameAs: [SEE_FOREVER_URL]
      },
      {
        "@type": "Person",
        "@id": `${SITE_URL}/#levi-eckman`,
        name: "Levi W. Eckman, J.D.",
        jobTitle: "Convening Director and Administrator, From Silos to Solutions 2026",
        url: `${SITE_URL}/learn-more`,
        worksFor: {
          "@id": `${SITE_URL}/#organization`
        },
        description:
          "Levi W. Eckman, J.D. serves as Convening Director and Administrator for From Silos to Solutions 2026."
      },
      {
        "@type": "Event",
        "@id": `${SITE_URL}/#event`,
        name: SITE_NAME,
        description:
          "Power Through Partnerships: a convening to coordinate supports for opportunity and justice-involved youth and young adults.",
        url: SITE_URL,
        image: [`${SITE_URL}${SEO_OG_IMAGE}`],
        startDate: "2026-04-01T08:30:00-04:00",
        endDate: "2026-04-03T19:30:00-04:00",
        eventStatus: "https://schema.org/EventScheduled",
        eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
        organizer: {
          "@id": `${SITE_URL}/#organization`
        },
        location: [
          {
            "@type": "Place",
            name: "National Union Building",
            address: {
              "@type": "PostalAddress",
              addressLocality: "Washington",
              addressRegion: "DC",
              addressCountry: "US"
            }
          },
          {
            "@type": "Place",
            name: "Maya Angelou Learning Campus Performing Arts Center",
            address: {
              "@type": "PostalAddress",
              addressLocality: "Washington",
              addressRegion: "DC",
              addressCountry: "US"
            }
          }
        ],
        sameAs: [EVENTBRITE_URL]
      }
    ]
  };
}

export function getLeadershipStructuredData() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "AboutPage",
        "@id": `${SITE_URL}/learn-more#about`,
        url: `${SITE_URL}/learn-more`,
        name: "About From Silos to Solutions 2026",
        description:
          "Background on the FS2S mission, convening leadership, See Forever Foundation, and past convenings."
      },
      {
        "@type": "Person",
        "@id": `${SITE_URL}/learn-more#levi-eckman`,
        name: "Levi W. Eckman, J.D.",
        jobTitle: "Convening Director and Administrator",
        url: `${SITE_URL}/learn-more`,
        description:
          "Levi W. Eckman, J.D. serves as Convening Director and Administrator for From Silos to Solutions 2026."
      },
      {
        "@type": "Person",
        "@id": `${SITE_URL}/learn-more#clarisse-mendoza-davis`,
        name: "Dr. Clarisse Mendoza-Davis",
        jobTitle: "Foundation Leadership",
        url: `${SITE_URL}/learn-more`,
        worksFor: {
          "@type": "Organization",
          name: "See Forever Foundation"
        },
        description:
          "Dr. Clarisse Mendoza-Davis leads the broader organizational work that grounds From Silos to Solutions in scholar-centered education and advocacy."
      }
    ]
  };
}

export function getSessionStructuredData(session: SessionRecord) {
  const sessionTitle = displaySessionTitle(session);
  const sessionUrl = `${SITE_URL}/session/${session.id}`;
  const sessionEndDate = session.ends_at ?? session.starts_at;

  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: sessionTitle,
    description: session.description || session.short_description,
    url: sessionUrl,
    startDate: `${session.date}T${session.starts_at}:00-04:00`,
    endDate: `${session.date}T${sessionEndDate}:00-04:00`,
    eventStatus:
      session.status === "cancelled"
        ? "https://schema.org/EventCancelled"
        : "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: {
      "@type": "Place",
      name: `${session.venue}${session.room ? `, ${session.room}` : ""}`
    },
    organizer: {
      "@type": "Organization",
      name: "From Silos to Solutions 2026"
    },
    performer: session.speakers.map((speaker) => ({
      "@type": "Person",
      name: speaker.name,
      jobTitle: speaker.title ?? undefined
    })),
    isPartOf: {
      "@type": "Event",
      name: SITE_NAME,
      url: SITE_URL
    }
  };
}

export function getSessionMetadata(session: SessionRecord): Metadata {
  const sessionTitle = displaySessionTitle(session);
  const category = labelForCategory(session.category);
  const date = formatDateLabel(session.date);
  const time = formatTimeRange(session.starts_at, session.ends_at);
  const description = `${sessionTitle} is a ${category.toLowerCase()} session at ${SITE_NAME} on ${date} from ${time} in ${session.room}, ${session.venue}.`;

  return buildMetadata({
    title: `${sessionTitle} | ${category}`,
    description,
    path: `/session/${session.id}`,
    image: SEO_OG_IMAGE
  });
}
