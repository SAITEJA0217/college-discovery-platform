import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { compareSlugsSchema } from "@/lib/validations/college";

export async function GET(request: NextRequest) {
  try {
    // 1. Extract and validate the slugs query parameter
    const slugsParam = request.nextUrl.searchParams.get("slugs");

    if (!slugsParam) {
      return NextResponse.json(
        {
          error: {
            code: "INVALID_QUERY",
            message: "The 'slugs' query parameter is required.",
          },
        },
        { status: 400 }
      );
    }

    const parsedSlugs = compareSlugsSchema.safeParse(slugsParam);

    if (!parsedSlugs.success) {
      return NextResponse.json(
        {
          error: {
            code: "INVALID_QUERY",
            message: "Invalid query parameters.",
            details: parsedSlugs.error.errors,
          },
        },
        { status: 400 }
      );
    }

    const requestedSlugs = parsedSlugs.data;

    // 2. Fetch all requested colleges in a single query
    const colleges = await prisma.college.findMany({
      where: {
        slug: {
          in: requestedSlugs,
        },
      },
      select: {
        id: true,
        name: true,
        slug: true,
        city: true,
        state: true,
        type: true,
        annualFees: true,
        rating: true,
        totalReviewCount: true,
        avgPlacement: true,
        highestPlacement: true,
        placementPercent: true,
      },
    });

    // 3. Verify that all requested colleges were found
    if (colleges.length !== requestedSlugs.length) {
      const foundSlugs = new Set(colleges.map((c) => c.slug));
      const missingSlugs = requestedSlugs.filter((slug) => !foundSlugs.has(slug));

      return NextResponse.json(
        {
          error: {
            code: "COLLEGE_NOT_FOUND",
            message: "One or more colleges could not be found.",
            missingSlugs,
          },
        },
        { status: 404 }
      );
    }

    // 4. Order the results to exactly match the requested slugs sequence
    const orderedColleges = requestedSlugs.map((slug) =>
      colleges.find((c) => c.slug === slug)!
    );

    // 5. Return the successful response
    return NextResponse.json({
      data: orderedColleges,
      meta: {
        count: orderedColleges.length,
        requestedSlugs,
      },
    });
  } catch (error) {
    // 6. Handle unexpected errors safely
    console.error("Error in GET /api/colleges/compare:", error);
    return NextResponse.json(
      {
        error: {
          code: "INTERNAL_SERVER_ERROR",
          message: "Unable to complete college comparison.",
        },
      },
      { status: 500 }
    );
  }
}
