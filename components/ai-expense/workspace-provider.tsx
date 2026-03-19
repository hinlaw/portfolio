'use client';

import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from 'react';
import { listWorkspaces } from '@/api/client/workspaces';
import type { WorkspaceDTO, ReceiptLanguageOption } from '@/api/types/workspace';

const STORAGE_KEY = 'ai-expense-active-workspace-id';

interface WorkspaceContextValue {
    workspaces: WorkspaceDTO[];
    activeWorkspaceId: string | null;
    activeWorkspace: WorkspaceDTO | null;
    baseCurrency: string;
    receiptLanguage: ReceiptLanguageOption;
    isLoading: boolean;
    setActiveWorkspaceId: (id: string) => void;
    refreshWorkspaces: () => Promise<void>;
}

const WorkspaceContext = createContext<WorkspaceContextValue | null>(null);

export function useWorkspace(): WorkspaceContextValue {
    const ctx = useContext(WorkspaceContext);
    if (!ctx) {
        throw new Error('useWorkspace must be used within WorkspaceProvider');
    }
    return ctx;
}

interface WorkspaceProviderProps {
    children: ReactNode;
}

export function WorkspaceProvider({ children }: WorkspaceProviderProps) {
    const [workspaces, setWorkspaces] = useState<WorkspaceDTO[]>([]);
    const [activeWorkspaceId, setActiveWorkspaceIdState] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const refreshWorkspaces = useCallback(async () => {
        try {
            const list = await listWorkspaces();
            setWorkspaces(list);
        } catch {
            setWorkspaces([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const setActiveWorkspaceId = useCallback((id: string) => {
        setActiveWorkspaceIdState(id);
        if (typeof window !== 'undefined') {
            localStorage.setItem(STORAGE_KEY, id);
        }
    }, []);

    useEffect(() => {
        refreshWorkspaces();
    }, []);

    useEffect(() => {
        if (workspaces.length > 0 && !activeWorkspaceId) {
            const stored = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
            const found = stored ? workspaces.find((w) => w.id === stored) : null;
            const id = found ? found.id : workspaces[0].id;
            setActiveWorkspaceIdState(id);
            if (typeof window !== 'undefined') {
                localStorage.setItem(STORAGE_KEY, id);
            }
        }
    }, [workspaces, activeWorkspaceId]);

    const activeWorkspace = activeWorkspaceId
        ? workspaces.find((w) => w.id === activeWorkspaceId) ?? null
        : null;

    const baseCurrency = activeWorkspace?.base_currency ?? 'USD';
    const receiptLanguage = (activeWorkspace?.receipt_language as ReceiptLanguageOption | undefined) ?? 'en';

    const value: WorkspaceContextValue = {
        workspaces,
        activeWorkspaceId,
        activeWorkspace,
        baseCurrency,
        receiptLanguage,
        isLoading,
        setActiveWorkspaceId,
        refreshWorkspaces,
    };

    return (
        <WorkspaceContext.Provider value={value}>
            {children}
        </WorkspaceContext.Provider>
    );
}
