import { NextRequest, NextResponse } from "next/server";
import { TMDB_UPSTREAM_API_BASE } from "@/lib/tmdb";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ type: string; id: string }> }
) {
  const token = process.env.TMDB_API_TOKEN;

  if (!token) {
    return NextResponse.json(
      { error: "TMDB API token not configured" },
      { status: 500 }
    );
  }

  const params = await context.params;
  const { type, id } = params;

  if (!["movie", "tv"].includes(type)) {
    return NextResponse.json(
      { error: "Invalid media type. Use 'movie' or 'tv'" },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(
      `${TMDB_UPSTREAM_API_BASE}/${type}/${id}/videos`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData.status_message || "Failed to fetch videos" },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    // Filter for YouTube trailers and teasers
    const videos = data.results.filter(
      (video: { site: string; type: string }) =>
        video.site === "YouTube" &&
        (video.type === "Trailer" || video.type === "Teaser")
    );

    // Sort to prioritize official trailers
    videos.sort((a: { type: string; official?: boolean }, b: { type: string; official?: boolean }) => {
      if (a.type === "Trailer" && b.type !== "Trailer") return -1;
      if (a.type !== "Trailer" && b.type === "Trailer") return 1;
      if (a.official && !b.official) return -1;
      if (!a.official && b.official) return 1;
      return 0;
    });

    return NextResponse.json({
      id: data.id,
      results: videos,
    });
  } catch (error) {
    console.error("TMDB videos error:", error);
    return NextResponse.json(
      { error: "Failed to fetch videos" },
      { status: 500 }
    );
  }
}
