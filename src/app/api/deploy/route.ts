import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { mode, config } = body;

    // Validate input
    if (!mode || !config) {
      return NextResponse.json(
        { error: 'Missing required fields: mode, config' },
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
        name: config.projectName || 'Unnamed Project',
        description: config.description,
        mode,
        techStack: config.techStack ? JSON.stringify(config.techStack) : null,
        status: 'active',
      },
    });

    // Create agents based on selection
    const agentTypes = ['frontend', 'backend', 'database', 'devops', 'qa', 'docs', 'techlead'];
    const agentNames = {
      frontend: 'Frontend Engineer',
      backend: 'Backend Engineer',
      database: 'Database Specialist',
      devops: 'DevOps Engineer',
      qa: 'QA Engineer',
      docs: 'Documentation Writer',
      techlead: 'Tech Lead',
    };

    const enabledAgents = agentTypes.filter((type) => config.agents?.[type]);

    await Promise.all(
      enabledAgents.map((type) =>
        prisma.agent.create({
          data: {
            projectId: project.id,
            type,
            name: agentNames[type as keyof typeof agentNames],
            status: 'idle',
          },
        })
      )
    );

    // Create integrations
    const integrations = Object.entries(config.integrations || {})
      .filter(([_, integration]: any) => integration.enabled)
      .map(([type, integration]: any) => ({
        projectId: project.id,
        type,
        name: type.charAt(0).toUpperCase() + type.slice(1),
        enabled: true,
        config: JSON.stringify(integration),
        status: 'connected',
      }));

    if (integrations.length > 0) {
      await prisma.integration.createMany({
        data: integrations,
      });
    }

    // Create initial deployment
    const deployment = await prisma.deployment.create({
      data: {
        projectId: project.id,
        status: 'initializing',
        environment: 'production',
      },
    });

    // Log deployment initialization
    await prisma.activityLog.create({
      data: {
        deploymentId: deployment.id,
        type: 'deployment',
        level: 'info',
        message: `Project "${project.name}" initialized with ${enabledAgents.length} agents`,
        metadata: JSON.stringify({
          mode,
          agents: enabledAgents,
          integrations: integrations.map((i) => i.type),
        }),
      },
    });

    console.log('[Deployment Request]', {
      projectId: project.id,
      deploymentId: deployment.id,
      mode,
      agentCount: enabledAgents.length,
      integrations: integrations.map((i) => i.type),
    });

    return NextResponse.json({
      success: true,
      project,
      deployment,
      message: 'Deployment initiated successfully',
      dashboardUrl: `/mission-control/${deployment.id}`,
    });
  } catch (error) {
    console.error('[Deployment Error]', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const deploymentId = searchParams.get('id');

  if (!deploymentId) {
    return NextResponse.json(
      { error: 'Missing deployment ID' },
      { status: 400 }
    );
  }

  try {
    const deployment = await prisma.deployment.findUnique({
      where: { id: deploymentId },
      include: {
        project: {
          include: {
            agents: true,
            integrations: true,
          },
        },
        tasks: {
          include: {
            agent: true,
          },
          orderBy: { createdAt: 'desc' },
          take: 20,
        },
        logs: {
          orderBy: { createdAt: 'desc' },
          take: 50,
        },
        _count: {
          select: {
            tasks: true,
            logs: true,
          },
        },
      },
    });

    if (!deployment) {
      return NextResponse.json(
        { error: 'Deployment not found' },
        { status: 404 }
      );
    }

    // Calculate metrics
    const tasksByStatus = await prisma.task.groupBy({
      by: ['status'],
      where: { deploymentId },
      _count: true,
    });

    const metrics = {
      uptime: deployment.status === 'active' ? '99.9%' : 'N/A',
      tasksCompleted: tasksByStatus.find((t) => t.status === 'completed')?._count || 0,
      activeIssues: tasksByStatus.find((t) => t.status === 'in_progress')?._count || 0,
      deploymentsToday: 1, // TODO: Calculate from database
    };

    return NextResponse.json({ deployment, metrics });
  } catch (error) {
    console.error('[GET /api/deploy]', error);
    return NextResponse.json(
      { error: 'Failed to fetch deployment' },
      { status: 500 }
    );
  }
}
