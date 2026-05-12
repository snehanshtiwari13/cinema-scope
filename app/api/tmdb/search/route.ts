import { NextRequest, NextResponse } from "next/server";

// Hardcoded configuration to bypass environment variable issues
const TMDB_API_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5NDU2MmZlOTllZDIxNjAyYjE4ODQ2MmM0ZjQ4NTE0ZClsIm5pZil6MTc3ODU4MTcxNy4xMzUsInN1YiI6IjZhMDMwMGQ1ZGY3ZThjZDVmM2NmZDkyOSIsInNjb3BlcyI6WyJhcGZcmVhZCIsIjI2XJzaw9uIioxfQ.VCNYjCBkO3Z6ENuYz6Pn1h1V6C0ZzsLsYUqfS-dg3Y8';
const TMDB_UPSTREAM_API_BASE = 'https://tmdb-proxy.vercel.app/3';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query");
    const year = searchParams.get("year");

    // 1. Basic Validation
    if (!query) {
        return NextResponse.json(
            { error: "Query parameter is required" },
            { status: 400 }
        );
    }

    try {
        // 2. Construct the URL for Multi-Search (Movies, TV, People)
        const baseUrl = `${TMDB_UPSTREAM_API_BASE}/search/multi`;
        const params = new URLSearchParams({
            query: query,
            include_adult: 'false',
            language: 'en-US',
            page: '1'
        });

        if (year) {
            params.append('year', year);
        }

        // 3. Execute the Fetch request
        const response = await fetch(`${baseUrl}?${params.toString()}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${TMDB_API_TOKEN}`,
                'Accept': 'application/json'
            },
            // Prevent caching issues during development
            cache: 'no-store'
        });

        // 4. Handle API Errors (e.g., 401 Unauthorized or 404)
        if (!response.ok) {
            const errorText = await response.text();
            console.error("TMDB API Error Response:", errorText);
            return NextResponse.json(
                { error: "External API error", details: errorText },
                { status: response.status }
            );
        }

        const data = await response.json();
        
        // 5. Return the clean data to the front-end
        return NextResponse.json(data);

    } catch (error) {
        console.error("Internal Server Error in Search Route:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}