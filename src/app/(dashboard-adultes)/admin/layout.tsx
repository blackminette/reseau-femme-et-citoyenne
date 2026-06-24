// * src/app/(dashboard-adultes)/admin/layout.tsx

import React from 'react';
import AdminSideMenu from '@/components/AdminSideMenu';

export default function MembreLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-violet-50 flex">

            <aside className="w-1/6 fixed top-24 bottom-0 left-0 bg-white border-r border-violet-200 z-40 p-5 flex flex-col justify-between overflow-y-auto">
                <AdminSideMenu />
            </aside>

            <main className="w-5/6 ml-auto min-h-screen flex flex-col">

                <div className="flex-1 p-6">
                    <div className="mx-auto w-full">
                        {children}
                    </div>
                </div>
            </main>

        </div>
    );
}