'use client';

import React, { use } from 'react';
import ActivityAdventureView from './activity-view';
import { useActivityAdventureController } from './use-activity-adventure-controller';

type PageParams = Promise<{ id: string; actId: string }>;

export default function EnfantActivityPage({ params }: { params: PageParams }) {
    const { id, actId } = use(params);
    const controller = useActivityAdventureController({ id, actId });
    const { isModuleResolutionPending, ...viewProps } = controller;

    if (isModuleResolutionPending) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center text-violet-900">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-violet-600 border-t-transparent" />
                <p className="mt-4 text-violet-500">Chargement de ton aventure...</p>
            </div>
        );
    }

    return <ActivityAdventureView id={id} {...viewProps} />;
}
