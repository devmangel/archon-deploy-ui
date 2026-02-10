import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const deployment = await prisma.deployment.findUnique({
      where: { id: params.id },
      include: {
        project: true,
        tasks: {
          include: {
            agent: {
              select: {
                id: true,
                type: true,
                name: true,
                status: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
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

    return NextResponse.json({ deployment });
  } catch (error) {
    console.error('[GET /api/deployments/:id]', error);
    return NextResponse.json(
      { error: 'Failed to fetch deployment' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { status, completedAt } = body;

    const updateData: any = {};

    if (status) {
      updateData.status = status;
      
      // If marking as completed or failed, set completedAt
      if (['completed', 'failed'].includes(status) && !completedAt) {
        updateData.completedAt = new Date();
      }
    }

    if (completedAt) {
      updateData.completedAt = new Date(completedAt);
    }

    // Calculate duration if completed
    const deployment = await prisma.deployment.findUnique({
      where: { id: params.id },
      select: { startedAt: true },
    });

    if (deployment && updateData.completedAt) {
      const duration = Math.floor(
        (updateData.completedAt.getTime() - deployment.startedAt.getTime()) / 1000
      );
      updateData.duration = duration;
    }

    const updated = await prisma.deployment.update({
      where: { id: params.id },
      data: updateData,
      include: {
        project: true,
        _count: {
          select: {
            tasks: true,
            logs: true,
          },
        },
      },
    });

    // Log status change
    if (status) {
      await prisma.activityLog.create({
        data: {
          deploymentId: params.id,
          type: 'deployment',
          level: status === 'failed' ? 'error' : 'info',
          message: `Deployment status changed to ${status}`,
          metadata: JSON.stringify({ previousStatus: deployment, newStatus: status }),
        },
      });
    }

    return NextResponse.json({ deployment: updated });
  } catch (error: any) {
    console.error('[PATCH /api/deployments/:id]', error);
    
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Deployment not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to update deployment' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.deployment.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('[DELETE /api/deployments/:id]', error);
    
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Deployment not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to delete deployment' },
      { status: 500 }
    );
  }
}
