import { PrismaClient, CollegeType, ExamType, StudentCategory } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting to seed database...');

  // Clean up existing data if any
  await prisma.examCutoff.deleteMany();
  await prisma.review.deleteMany();
  await prisma.placement.deleteMany();
  await prisma.course.deleteMany();
  await prisma.college.deleteMany();

  // Create Colleges
  const iitb = await prisma.college.create({
    data: {
      name: 'Indian Institute of Technology Bombay',
      slug: 'iit-bombay',
      city: 'Mumbai',
      state: 'Maharashtra',
      locationInfo: 'Powai, Mumbai',
      type: CollegeType.GOVERNMENT,
      description: 'IIT Bombay is a public technical and research university in Powai, Mumbai. It is globally recognized for its engineering programs.',
      annualFees: 200000.00,
      rating: 4.8,
      totalReviewCount: 150,
      avgPlacement: 2000000.00,
      highestPlacement: 30000000.00,
      placementPercent: 95.5,
      courses: {
        create: [
          { name: 'Computer Science and Engineering', degree: 'B.Tech', durationYears: 4, fees: 220000 },
          { name: 'Electrical Engineering', degree: 'B.Tech', durationYears: 4, fees: 220000 }
        ]
      },
      placements: {
        create: [
          { year: 2023, averagePackage: 2300000, highestPackage: 35000000, placementPercent: 96 },
          { year: 2022, averagePackage: 2100000, highestPackage: 30000000, placementPercent: 95 }
        ]
      },
      reviews: {
        create: [
          { rating: 5, title: 'Excellent Academics', comment: 'Top notch faculty and peer group.', reviewerName: 'Rahul K' }
        ]
      }
    },
    include: { courses: true }
  });

  const iitd = await prisma.college.create({
    data: {
      name: 'Indian Institute of Technology Delhi',
      slug: 'iit-delhi',
      city: 'New Delhi',
      state: 'Delhi',
      locationInfo: 'Hauz Khas, New Delhi',
      type: CollegeType.GOVERNMENT,
      description: 'IIT Delhi is a prestigious institute known for its excellent research facilities and engineering education.',
      annualFees: 210000.00,
      rating: 4.7,
      totalReviewCount: 120,
      avgPlacement: 2100000.00,
      highestPlacement: 28000000.00,
      placementPercent: 94.0,
      courses: {
        create: [
          { name: 'Computer Science and Engineering', degree: 'B.Tech', durationYears: 4, fees: 230000 },
          { name: 'Mechanical Engineering', degree: 'B.Tech', durationYears: 4, fees: 230000 }
        ]
      }
    },
    include: { courses: true }
  });

  const bits = await prisma.college.create({
    data: {
      name: 'BITS Pilani',
      slug: 'bits-pilani',
      city: 'Pilani',
      state: 'Rajasthan',
      locationInfo: 'Vidya Vihar, Pilani',
      type: CollegeType.PRIVATE,
      description: 'Birla Institute of Technology & Science, Pilani is an all-India Institute for higher education.',
      annualFees: 500000.00,
      rating: 4.6,
      totalReviewCount: 200,
      avgPlacement: 1800000.00,
      highestPlacement: 20000000.00,
      placementPercent: 97.0,
      courses: {
        create: [
          { name: 'Computer Science', degree: 'B.E.', durationYears: 4, fees: 550000 },
          { name: 'Electronics & Instrumentation', degree: 'B.E.', durationYears: 4, fees: 550000 }
        ]
      }
    },
    include: { courses: true }
  });

  const nit_trichy = await prisma.college.create({
    data: {
      name: 'National Institute of Technology Tiruchirappalli',
      slug: 'nit-trichy',
      city: 'Tiruchirappalli',
      state: 'Tamil Nadu',
      locationInfo: 'Tanjore Main Road, NH67, near BHEL',
      type: CollegeType.GOVERNMENT,
      description: 'NIT Trichy is one of the oldest and most reputed NITs in India.',
      annualFees: 150000.00,
      rating: 4.5,
      totalReviewCount: 180,
      avgPlacement: 1200000.00,
      highestPlacement: 15000000.00,
      placementPercent: 92.0,
      courses: {
        create: [
          { name: 'Computer Science and Engineering', degree: 'B.Tech', durationYears: 4, fees: 160000 },
          { name: 'Civil Engineering', degree: 'B.Tech', durationYears: 4, fees: 160000 }
        ]
      }
    },
    include: { courses: true }
  });

  const vit = await prisma.college.create({
    data: {
      name: 'Vellore Institute of Technology',
      slug: 'vit-vellore',
      city: 'Vellore',
      state: 'Tamil Nadu',
      locationInfo: 'Katpadi',
      type: CollegeType.PRIVATE,
      description: 'VIT is a private deemed university and an Institute of Eminence.',
      annualFees: 300000.00,
      rating: 4.1,
      totalReviewCount: 500,
      avgPlacement: 800000.00,
      highestPlacement: 12000000.00,
      placementPercent: 90.0,
      courses: {
        create: [
          { name: 'Computer Science and Engineering', degree: 'B.Tech', durationYears: 4, fees: 350000 },
          { name: 'Information Technology', degree: 'B.Tech', durationYears: 4, fees: 300000 }
        ]
      }
    },
    include: { courses: true }
  });
  
  // Add another 5 basic colleges quickly to hit the 10 minimum
  const collegesData = [
    { name: 'NIT Warangal', slug: 'nit-warangal', city: 'Warangal', state: 'Telangana', type: CollegeType.GOVERNMENT },
    { name: 'NIT Surathkal', slug: 'nit-surathkal', city: 'Mangalore', state: 'Karnataka', type: CollegeType.GOVERNMENT },
    { name: 'DTU', slug: 'delhi-technological-university', city: 'New Delhi', state: 'Delhi', type: CollegeType.PUBLIC },
    { name: 'NSUT', slug: 'nsut-delhi', city: 'New Delhi', state: 'Delhi', type: CollegeType.PUBLIC },
    { name: 'SRM Institute of Science and Technology', slug: 'srm-chennai', city: 'Chennai', state: 'Tamil Nadu', type: CollegeType.PRIVATE }
  ];

  for (const c of collegesData) {
    await prisma.college.create({
      data: {
        ...c,
        annualFees: 200000,
        rating: 4.0,
      }
    });
  }

  // Create Cutoffs for IIT Bombay
  const iitb_cse = iitb.courses.find(c => c.name.includes('Computer'));
  if (iitb_cse) {
    await prisma.examCutoff.createMany({
      data: [
        { exam: ExamType.JEE_ADVANCED, category: StudentCategory.GENERAL, admissionYear: 2023, closingRank: 67, collegeId: iitb.id, courseId: iitb_cse.id },
        { exam: ExamType.JEE_ADVANCED, category: StudentCategory.OBC, admissionYear: 2023, closingRank: 35, collegeId: iitb.id, courseId: iitb_cse.id },
      ]
    });
  }

  // Create Cutoffs for IIT Delhi
  const iitd_cse = iitd.courses.find(c => c.name.includes('Computer'));
  if (iitd_cse) {
    await prisma.examCutoff.create({
      data: { exam: ExamType.JEE_ADVANCED, category: StudentCategory.GENERAL, admissionYear: 2023, closingRank: 118, collegeId: iitd.id, courseId: iitd_cse.id }
    });
  }

  // Create Cutoffs for NIT Trichy
  const nitt_cse = nit_trichy.courses.find(c => c.name.includes('Computer'));
  if (nitt_cse) {
    await prisma.examCutoff.create({
      data: { exam: ExamType.JEE_MAIN, category: StudentCategory.GENERAL, admissionYear: 2023, closingRank: 1500, collegeId: nit_trichy.id, courseId: nitt_cse.id }
    });
  }

  console.log('Seeding completed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
