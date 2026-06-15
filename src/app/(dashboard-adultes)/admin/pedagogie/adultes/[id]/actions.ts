// * src/app/(dashboard-adultes)/admin/pedagogie/adultes/[id]/actions.ts
'use server';

import React from 'react';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function getModuleAndCours(id: number) {
    try {
        const result = await prisma.module.findUnique({
            where: { id: id },
            include: {
                cours: true
            }
        })
        return { success: true, data: result }
    } catch (error) {
        return { success: false, error: "Erreur lors de la récupération du module" }
    }
}