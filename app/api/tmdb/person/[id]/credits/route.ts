import { NextRequest, NextResponse } from "next/server";
import { TMDB_UPSTREAM_API_BASE } from "@/lib/tmdb";

const TMDB_API_TOKEN = process.env.TMDB_API_TOKEN;

export interface CreditItem {
  id: number;
  media_type: "movie" | "tv";
  title?: string;
  name?: string;
  poster_path?: string | null;
  release_date?: string;
  first_air_date?: string;
  vote_average?: number;
  overview?: string;
  popularity?: number;
  character?: string;
  job?: string;
  department?: string;
}

export interface CombinedCreditsResponse {
  id: number;
  cast: CreditItem[];
  crew: CreditItem[];
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!TMDB_API_TOKEN) {
    return NextResponse.json(
      { error: "TMDB API token not configured" },
      { status: 500 }
    );
  }

  const { id } = await params;

  if (!id) {
    return NextResponse.json(
      { error: "Person ID is required" },
      { status: 400 }
    );
  }

  try {
    // Fetch combined credits (both movie and TV)
    const url = new URL(`${TMDB_UPSTREAM_API_BASE}/person/${id}/combined_credits`);
    url.searchParams.set("language", "en-US");

    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${TMDB_API_TOKEN}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`TMDB API error: ${response.status}`);
    }

    const data: CombinedCreditsResponse = await response.json();

    // Combine cast and crew, removing duplicates
    const allCredits = [...data.cast, ...data.crew];
    
    // Remove duplicates by id and media_type
    const seen = new Set<string>();
    const uniqueCredits = allCredits.filter((item) => {
      const key = `${item.media_type}-${item.id}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    // Sort by popularity (highest first)
    const sortedCredits = uniqueCredits.sort(
      (a, b) => (b.popularity || 0) - (a.popularity || 0)
    );

    // Add media_type to each item (cast items might not have it)
    const creditsWithType = sortedCredits.map((item) => ({
      ...item,
      media_type: item.media_type || (item.title ? "movie" : "tv"),
    }));

    return NextResponse.json({
      id: data.id,
      credits: creditsWithType,
      total: creditsWithType.length,
    });
  } catch (error) {
    console.error("TMDB person credits error:", error);
    return NextResponse.json(
      { error: "Failed to fetch person credits from TMDB" },
      { status: 500 }
    );
  }
}
