export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { predictorRequestSchema } from "@/lib/validations/college";

export async function POST(request: NextRequest) {
  try {
    // 1. Parse and validate the request body
    const body = await request.json().catch(() => null);

    if (!body) {
      return NextResponse.json(
        {
          error: {
            code: "INVALID_JSON",
            message: "Malformed JSON request body.",
          },
        },
        { status: 400 }
      );
    }

    const parsedBody = predictorRequestSchema.safeParse(body);

    if (!parsedBody.success) {
      return NextResponse.json(
        {
          error: {
            code: "INVALID_REQUEST",
            message: "Invalid predictor request parameters.",
            details: parsedBody.error.errors,
          },
        },
        { status: 400 }
      );
    }

    const { exam, category, rank } = parsedBody.data;

    // 2. Fetch all matching historical cutoffs
    // A college is a potential match if its historical closing rank >= student rank
    const cutoffs = await prisma.examCutoff.findMany({
      where: {
        exam,
        category,
        closingRank: {
          gte: rank,
        },
      },
      include: {
        college: {
          select: {
            id: true,
            name: true,
            slug: true,
            city: true,
            state: true,
            type: true,
            rating: true,
            annualFees: true,
          },
        },
        course: {
          select: {
            id: true,
            name: true,
            degree: true,
          },
        },
      },
    });

    // 3. Process the matches to find the strongest/closest cutoff for each college
    const collegeMatchMap = new Map<string, typeof cutoffs[0]>();

    for (const cutoff of cutoffs) {
      const existingMatch = collegeMatchMap.get(cutoff.collegeId);

      if (!existingMatch) {
        collegeMatchMap.set(cutoff.collegeId, cutoff);
      } else {
        // We want the smallest closingRank that is still >= student's rank (which is true for all items here).
        // If closingRanks are equal, we prefer the latest admission year.
        if (cutoff.closingRank < existingMatch.closingRank) {
          collegeMatchMap.set(cutoff.collegeId, cutoff);
        } else if (
          cutoff.closingRank === existingMatch.closingRank &&
          cutoff.admissionYear > existingMatch.admissionYear
        ) {
          collegeMatchMap.set(cutoff.collegeId, cutoff);
        }
      }
    }

    // 4. Format and sort the results
    const results = Array.from(collegeMatchMap.values()).map((cutoff) => ({
      college: cutoff.college,
      match: {
        closingRank: cutoff.closingRank,
        admissionYear: cutoff.admissionYear,
        course: cutoff.course || null,
      },
    }));

    // Sorting Logic:
    // 1. Closest historical closing rank (smallest difference to student rank, which means smallest closingRank)
    // 2. Higher college rating (descending)
    // 3. College name (ascending)
    results.sort((a, b) => {
      if (a.match.closingRank !== b.match.closingRank) {
        return a.match.closingRank - b.match.closingRank;
      }
      
      const ratingA = a.college.rating || 0;
      const ratingB = b.college.rating || 0;
      if (ratingA !== ratingB) {
        return ratingB - ratingA;
      }
      
      return a.college.name.localeCompare(b.college.name);
    });

    // 5. Return success response
    return NextResponse.json({
      data: results,
      meta: {
        exam,
        category,
        rank,
        count: results.length,
      },
    });
  } catch (error) {
    console.error("Error in POST /api/predictor:", error);
    return NextResponse.json(
      {
        error: {
          code: "INTERNAL_SERVER_ERROR",
          message: "An unexpected error occurred while running the predictor.",
        },
      },
      { status: 500 }
    );
  }
}
