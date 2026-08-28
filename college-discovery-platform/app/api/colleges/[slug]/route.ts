export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { collegeSlugSchema } from "@/lib/validations/college";

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    // 1. Validate the slug format
    const parsedSlug = collegeSlugSchema.safeParse(params.slug);

    if (!parsedSlug.success) {
      return NextResponse.json(
        {
          error: {
            code: "INVALID_SLUG",
            message: "The provided slug is invalid.",
            details: parsedSlug.error.errors,
          },
        },
        { status: 400 }
      );
    }

    const slug = parsedSlug.data;

    // 2. Fetch college with relations using a single query
    const college = await prisma.college.findUnique({
      where: { slug },
      select: {
        id: true,
        name: true,
        slug: true,
        city: true,
        state: true,
        locationInfo: true,
        type: true,
        description: true,
        annualFees: true,
        rating: true,
        totalReviewCount: true,
        avgPlacement: true,
        highestPlacement: true,
        placementPercent: true,
        courses: {
          select: {
            id: true,
            name: true,
            degree: true,
            durationYears: true,
            fees: true,
          },
          orderBy: {
            name: "asc", // Deterministic alphabetical order
          },
        },
        placements: {
          select: {
            year: true,
            averagePackage: true,
            highestPackage: true,
            medianPackage: true,
            placementPercent: true,
          },
          orderBy: {
            year: "desc", // Newest year first
          },
        },
        reviews: {
          select: {
            id: true,
            rating: true,
            title: true,
            comment: true,
            reviewerName: true,
            createdAt: true,
          },
          orderBy: {
            createdAt: "desc", // Newest first
          },
        },
        examCutoffs: {
          select: {
            id: true,
            exam: true,
            category: true,
            admissionYear: true,
            openingRank: true,
            closingRank: true,
            course: {
              select: {
                id: true,
                name: true,
                degree: true,
              },
            },
          },
          orderBy: [
            { admissionYear: "desc" }, // Admission year descending
            { closingRank: "asc" },    // Then closing rank ascending
          ],
        },
      },
    });

    // 3. Handle 404 if college is not found
    if (!college) {
      return NextResponse.json(
        {
          error: {
            code: "COLLEGE_NOT_FOUND",
            message: "College not found.",
          },
        },
        { status: 404 }
      );
    }

    // 4. Return successful response
    return NextResponse.json({
      data: college,
    });
  } catch (error) {
    // 5. Catch all unexpected errors (500)
    console.error(`Error in GET /api/colleges/${params.slug}:`, error);
    return NextResponse.json(
      {
        error: {
          code: "INTERNAL_SERVER_ERROR",
          message: "Unable to retrieve college details.",
        },
      },
      { status: 500 }
    );
  }
}
