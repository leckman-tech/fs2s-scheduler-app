import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";
import { createPublicSupabaseClient } from "@/lib/supabase/public";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const client = createPublicSupabaseClient();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1
    },
    {
      url: `${SITE_URL}/learn-more`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8
    },
    {
      url: `${SITE_URL}/lobby-day`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.78
    },
    {
      url: `${SITE_URL}/speakers`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.75
    }
  ];

  try {
    const { data, error } = await client
      .from("sessions")
      .select("id,date")
      .eq("published", true)
      .order("date", { ascending: true });

    if (error || !data) {
      if (error) {
        console.error(error);
      }
      return staticRoutes;
    }

    const sessionRoutes: MetadataRoute.Sitemap = data.map((session) => ({
      url: `${SITE_URL}/session/${session.id}`,
      lastModified: session.date ? new Date(`${session.date}T12:00:00-04:00`) : now,
      changeFrequency: "weekly",
      priority: 0.7
    }));

    return [...staticRoutes, ...sessionRoutes];
  } catch (error) {
    console.error(error);
    return staticRoutes;
  }
}
