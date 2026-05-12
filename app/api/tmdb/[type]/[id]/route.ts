import { NextRequest, NextResponse } from "next/server";
import { TMDB_UPSTREAM_API_BASE } from "@/lib/tmdb";

const TMDB_API_TOKEN = process.env.TMDB_API_TOKEN;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ type: string; id: string }> }
) {
  if (!TMDB_API_TOKEN) {
    return NextResponse.json(
      { error: "TMDB API token not configured" },
      { status: 500 }
    );
  }

  const { type, id } = await params;

  if (!type || !id) {
    return NextResponse.json(
      { error: "Type and ID are required" },
      { status: 400 }
    );
  }

  // Validate type
  if (!["movie", "tv", "person"].includes(type)) {
    return NextResponse.json(
      { error: "Invalid type. Must be movie, tv, or person" },
      { status: 400 }
    );
  }

  try {
    // Build the URL with append_to_response for additional data
    const url = new URL(`${TMDB_UPSTREAM_API_BASE}/${type}/${id}`);
    url.searchParams.set("language", "en-US");
    
    if (type === "movie") {
      url.searchParams.set("append_to_response", "credits,videos,release_dates");
    } else if (type === "tv") {
      url.searchParams.set("append_to_response", "credits,videos,content_ratings");
    } else if (type === "person") {
      url.searchParams.set("append_to_response", "movie_credits,tv_credits,images");
    }

    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${TMDB_API_TOKEN}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`TMDB API error: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("TMDB details error:", error);
    return NextResponse.json(
      { error: "Failed to fetch details from TMDB" },
      { status: 500 }
    );
  }
}
