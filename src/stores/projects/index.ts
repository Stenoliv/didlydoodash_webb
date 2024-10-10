import { Project, ProjectStatus } from "@/utils/types";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";


export interface ProjectStoreState {
    projects: Project[];
    active: () => Project[];
    completed: () => Project[];
    archived: () => Project[];
    setProjects: (projects: Project[]) => void;
    addProject: (project: Project) => void;
    removeProject: (project: Project) => void;
    project: Project | null;
    setProject: (project: Project | null) => void;
}

export const useProjectStore = create<ProjectStoreState>()(
    persist((set, get) => ({
        projects: [],
        setProjects: (projects) => set({ projects: projects }),
        addProject: (project) => set((state) => ({
            projects: [
                ...state.projects,
                project
            ]
        })),
        removeProject: (project) => set((state) => ({
            projects: state.projects.filter((fproject) => fproject.id !== project.id),
        })),

        project: null,
        setProject: (project) => set({ project: project}),

        active: () => get().projects.filter((project) => project.status === ProjectStatus.Active),
        completed: () => get().projects.filter((project) => project.status === ProjectStatus.Completed),
        archived: () => get().projects.filter((project) => project.status === ProjectStatus.Archived),
    }), {
        name: "project-store",
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({
            projects: state.projects,
            project: state.project
        })
    })
)