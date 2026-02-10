import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');

    const projects = await prisma.project.findMany({
      where: status ? { status } : undefined,
      include: {
        deployments: {
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
        agents: {
          select: {
            id: true,
            type: true,
            status: true,
          },
        },
        _count: {
          select: {
            deployments: true,
            agents: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ projects });
  } catch (error) {
    console.error('[GET /api/projects]', error);
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, mode, techStack } = body;

    // Validation
    if (!name || !mode) {
      return NextResponse.json(
        { error: 'Missing required fields: name, mode' },
        { status: 400 }
      );
    }

    if (!['new', 'existing'].includes(mode)) {
      return NextResponse.json(
        { error: 'Invalid mode. Must be "new" or "existing"' },
        { status: 400 }
      );
    }

    // Create project
    const project = await prisma.project.create({
      data: {
        name,
        description,
        mode,
        techStack: techStack ? JSON.stringify(techStack) : null,
        status: 'active',
      },
    });

    return NextResponse.json({ project }, { status: 201 });
  } catch (error) {
    console.error('[POST /api/projects]', error);
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    );
  }
}
