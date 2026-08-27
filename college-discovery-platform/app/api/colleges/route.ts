import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCollegesQuerySchema } from "@/lib/validations/college";
import { Prisma } from "@prisma/client";

export async function GET(request: NextRequest) {
  try {
    // 1. Parse and validate query parameters
    const searchParams = Object.fromEntries(request.nextUrl.searchParams);
    const parsedParams = getCollegesQuerySchema.safeParse(searchParams);

    if (!parsedParams.success) {
      return NextResponse.json(
        {
          error: {
            code: "INVALID_QUERY",
            message: "Invalid query parameters.",
            details: parsedParams.error.errors,
          },
        },
        { status: 400 }
      );
    }

    const {
      search,
      city,
      state,
      minFees,
      maxFees,
      minRating,
      sort,
      page,
      limit,
    } = parsedParams.data;

    // 2. Build the Prisma where clause dynamically
    const where: Prisma.CollegeWhereInput = {};

    if (search) {
      where.name = {
        contains: search,
        mode: "insensitive", // Case-insensitive search
      };
    }

    if (city) {
      where.city = {
        equals: city,
        mode: "insensitive",
      };
    }

    if (state) {
      where.state = {
        equals: state,
        mode: "insensitive",
      };
    }

    if (minFees !== undefined || maxFees !== undefined) {
      where.annualFees = {};
      if (minFees !== undefined) where.annualFees.gte = minFees;
      if (maxFees !== undefined) where.annualFees.lte = maxFees;
    }

    if (minRating !== undefined) {
      where.rating = {
        gte: minRating,
      };
    }

    // 3. Determine the sorting order
    let orderBy: Prisma.CollegeOrderByWithRelationInput = {};
    switch (sort) {
      case "rating-asc":
        orderBy = { rating: "asc" };
        break;
      case "fees-asc":
        orderBy = { annualFees: "asc" };
        break;
      case "fees-desc":
        orderBy = { annualFees: "desc" };
        break;
      case "name-asc":
        orderBy = { name: "asc" };
        break;
      case "name-desc":
        orderBy = { name: "desc" };
        break;
      case "rating-desc":
      default:
        orderBy = { rating: "desc" };
        break;
    }

    // 4. Calculate pagination skip
    const skip = (page - 1) * limit;

    // 5. Execute count and data queries efficiently using a transaction
    const [total, colleges] = await prisma.$transaction([
      prisma.college.count({ where }),
      prisma.college.findMany({
        where,
        orderBy,
        skip,
        take: limit,
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
      }),
    ]);

    const totalPages = Math.ceil(total / limit);

    // 6. Return standard response structure
    return NextResponse.json({
      data: colleges,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    });
  } catch (error) {
    // 7. Log error and return sanitized 500 response
    console.error("Error in GET /api/colleges:", error);
    return NextResponse.json(
      {
        error: {
          code: "INTERNAL_SERVER_ERROR",
          message: "An unexpected error occurred while fetching colleges.",
        },
      },
      { status: 500 }
    );
  }
}
