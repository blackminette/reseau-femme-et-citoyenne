'use client';

import { useEffect } from 'react';

const SCRIPT_ID = 'milo-widget-script';
const WIDGET_STYLE_ID = 'milo-widget-styles';

/** Charge Milo seulement dans l'espace enfant et retire son DOM hors de cet espace. */
export default function MiloWidgetLoader() {
    useEffect(() => {
        if (document.getElementById('aiw-panel')) {
            return;
        }

        const script = document.createElement('script');
        script.id = SCRIPT_ID;
        script.src = '/ai-widget.js?v=20260715';
        script.async = true;
        document.body.appendChild(script);

        return () => {
            document.getElementById('aiw-btn')?.remove();
            document.getElementById('aiw-panel')?.remove();
            document.getElementById(WIDGET_STYLE_ID)?.remove();
            script.remove();
        };
    }, []);

    return null;
}
