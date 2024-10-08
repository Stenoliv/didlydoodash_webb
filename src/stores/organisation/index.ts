import { Organisation } from "@/utils/types";
import { createJSONStorage, persist } from "zustand/middleware";
import { create } from "zustand";

export interface OrganisationStoreType {
    organisation: Organisation | null;
    setOrganisation: (org: Organisation | null) => void;
    organisations: Organisation[];
    addOrganisation: (org: Organisation) => void;
    removeOrganisation: (org: Organisation) => void;
    setOrganisations: (orgs: Organisation[]) => void;
}

export const useOrgStore = create<OrganisationStoreType>()(
    persist(
        (set) => ({
            organisation: null,
            setOrganisation: (org) => set({organisation: org}),
            organisations: [] as Organisation[],
            addOrganisation: (org) => set((state) => ({
                organisations: [...state.organisations, org]
            })),
            removeOrganisation: (org) => set((state) => ({
                organisations: state.organisations.filter(o => o.id !== org.id)
            })),
            setOrganisations: (orgs) => set({ organisations: orgs})
        }),{
            name: "org-store",
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                organisation: state.organisation,
                organisations: state.organisations
            })
        }
    ))