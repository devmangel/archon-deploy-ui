import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const deployments = await prisma.deployment.findMany({
      where: { projectId: params.id },
      include: {
        tasks: {
          select: {
            id: true,
            title: true,
            status: true,
            priority: true,
          },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        _count: {
          select: {
            tasks: true,
            logs: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ deployments });
  } catch (error) {
    console.error('[GET /api/projects/:id/deployments]', error);
    return NextResponse.json(
      { error: 'Failed to fetch deployments' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { branch, commitSha, environment = 'production' } = body;

    // Verify project exists
    const project = await prisma.project.findUnique({
      where: { id: params.id },
    });

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    // Create deployment
    const deployment = await prisma.deployment.create({
      data: {
        projectId: params.id,
        branch,
        commitSha,
        environment,
        status: 'initializing',
      },
      include: {
        project: true,
      },
    });

    // Create activity log
    await prisma.activityLog.create({
      data: {
        deploymentId: deployment.id,
        type: 'deployment',
        level: 'info',
        message: `Deployment ${deployment.id} initialized for ${environment}`,
        metadata: JSON.stringify({ branch, commitSha }),
      },
    });

    return NextResponse.json({ deployment }, { status: 201 });
  } catch (error) {
    console.error('[POST /api/projects/:id/deployments]', error);
    return NextResponse.json(
      { error: 'Failed to create deployment' },
      { status: 500 }
    );
  }
}
