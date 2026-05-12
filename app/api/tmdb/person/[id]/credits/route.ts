import { NextRequest, NextResponse } from "next/server";

// Using the EXACT names from your Vercel Dashboard (image_8fca44.png)
const TMDB_UPSTREAM_API_BASE = process.env.NEXT_PUBLIC_TMDB_PROXY_URL || 'https://api.themoviedb.org/3';
const TMDB_API_TOKEN = process.env.NEXT_PUBLIC_TMDB_API_KEY;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!TMDB_API_TOKEN) {
    return NextResponse.json({ error: "API Key Missing in Vercel" }, { status: 500 });
  }

  const { id } = await params;

  try {
    // 1. Clean the base URL (removes trailing slash if it exists)
    const baseUrl = TMDB_UPSTREAM_API_BASE.replace(/\/$/, "");

    // 2. Build the URL intelligently
    // If your proxy already has /3, don't add it again.
    const versionPath = baseUrl.endsWith('/3') ? "" : "/3";
    const url = new URL(`${baseUrl}${versionPath}/person/${id}/combined_credits`);
    url.searchParams.set("language", "en-US");

    const response = await fetch(url.toString(), {
      headers: {
        // Ensure "Bearer " is there. This is what fixed the 401 in image_902199.png
        Authorization: `Bearer ${TMDB_API_TOKEN.trim()}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      return NextResponse.json({ error: "TMDB Rejected Key" }, { status: response.status });
    }

    const data = await response.json();
    const allCredits = [...(data.cast || []), ...(data.crew || [])];
    
    // Remove duplicates
    const seen = new Set<string>();
    const uniqueCredits = allCredits.filter((item) => {
      const key = `${item.media_type}-${item.id}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    return NextResponse.json({
      id: data.id,
      credits: uniqueCredits.sort((a, b) => (b.popularity || 0) - (a.popularity || 0)),
      total: uniqueCredits.length,
    });

  } catch (error) {
    return NextResponse.json({ error: "Server Crash" }, { status: 500 });
  }
}