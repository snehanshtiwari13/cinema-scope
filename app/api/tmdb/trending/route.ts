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
  const type = searchParams.get("type") || "movie"; // movie or tv
  const timeWindow = searchParams.get("time_window") || "week"; // day or week

  try {
    const response = await fetch(
      `${TMDB_UPSTREAM_API_BASE}/trending/${type}/${timeWindow}`,
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
        { error: errorData.status_message || "Failed to fetch trending" },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    // Add media_type to results if not present
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
    console.error("TMDB trending error:", error);
    return NextResponse.json(
      { error: "Failed to fetch trending content" },
      { status: 500 }
    );
  }
}
