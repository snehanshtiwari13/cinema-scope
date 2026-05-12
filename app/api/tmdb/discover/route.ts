import { NextRequest, NextResponse } from "next/server";
import { TMDB_UPSTREAM_API_BASE } from "@/lib/tmdb";

export async function GET(request: NextRequest) {
  const token = process.env.TMDB_API_TOKEN;

  if (!token) {
    return NextResponse.json(
      { error: "TMDB API token not configured" },
      { status: 500 }
    );
  }

  const searchParams = request.nextUrl.searchParams;
  const type = searchParams.get("type") || "movie";
  const genreId = searchParams.get("genre");
  const page = searchParams.get("page") || "1";

  try {
    const params = new URLSearchParams({
      page,
      sort_by: "popularity.desc",
    });

    if (genreId) {
      params.set("with_genres", genreId);
    }

    const response = await fetch(`/api/tmdb/person/${id}/credits`);
const data = await response.json();

if (!response.ok) {
  throw new Error(data.error || "Failed to fetch filmography");
}

// Use the data (usually data.credits based on the backend we wrote)
setCredits(data.credits);

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData.status_message || "Failed to discover content" },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    // Add media_type to results
    const results = data.results.map((item: Record<string, unknown>) => ({
      ...item,
      media_type: type,
    }));

    return NextResponse.json({
      page: data.page,
      results,
      total_pages: data.total_pages,
      total_results: data.total_results,
    });
  } catch (error) {
    console.error("TMDB discover error:", error);
    return NextResponse.json(
      { error: "Failed to discover content" },
      { status: 500 }
    );
  }
}
