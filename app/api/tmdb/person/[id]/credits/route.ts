import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const auth = process.env.NEXT_PUBLIC_TMDB_API_KEY;

  if (!auth) {
    return NextResponse.json({ error: "Config Missing" }, { status: 500 });
  }

  try {
    const url = new URL("https://api.themoviedb.org/3/discover/movie");
    // Forward all incoming search params to TMDB
    searchParams.forEach((value, key) => {
      url.searchParams.append(key, value);
    });

    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${auth.trim()}`,
        "Content-Type": "application/json",
      },
    });

    // ONLY DEFINE 'data' ONCE HERE
    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ error: "TMDB Error", details: data }, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}