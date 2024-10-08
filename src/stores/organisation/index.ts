import { Organisation } from "@/utils/types";
import { createJSONStorage, persist } from "zustand/middleware";
import { create } from "zustand";
import { useAuthStore } from "../auth/store";

export interface OrganisationStoreType {
    organisation: Organisation | undefined;
    owner: boolean;
    setOrganisation: (org: Organisation | undefined) => void;
    organisations: Organisation[];
    addOrganisation: (org: Organisation) => void;
    removeOrganisation: (org: Organisation) => void;
    setOrganisations: (orgs: Organisation[]) => void;
}

export const useOrgStore = create<OrganisationStoreType>()(
    persist(
        (set) => ({
            organisation: undefined,
            owner: false,
            setOrganisation: (org) => {
                const { user } = useAuthStore.getState()
                if (org?.owner.user.id === user?.id) {
                    set({ owner: true})
                } else set({ owner: false})
                set({organisation: org})
            },
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