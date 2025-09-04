// app/dashboard/page.tsx (or similar)
import ProjectManagement from '@/components/project-management/ProjectManagement';

export default function DashboardPage() {
    return (
        <div className="h-screen flex flex-col">
            {/* Potentially a header here */}
            <main className="flex-1 overflow-hidden">
                <ProjectManagement />
            </main>
        </div>
    );
}
