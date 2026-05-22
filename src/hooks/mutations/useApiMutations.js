import { useMutation, useQueryClient } from "@tanstack/react-query";
import { login } from "../../services/auth.services";
import { createDomaine, deleteDomaine, updateDomaine } from "../../services/domaine.services";
import {
  createEtablissement,
  deleteEtablissement,
  updateEtablissement,
} from "../../services/etablissement.services";
import { createMention, deleteMention, updateMention } from "../../services/mention.services";
import { createMetier, deleteMetier, updateMetier } from "../../services/metier.services";
import { createParcours, deleteParcours, updateParcours } from "../../services/parcours.services";
import { changePassword, updateProfile } from "../../services/profile.services";
import { createSerie, deleteSerie, updateSerie } from "../../services/serie.services";
import {
  createUser,
  deleteUser,
  resetUserPassword,
  toggleUserStatus,
  updateUser,
} from "../../services/user.services";
import { queryKeys } from "../queries/queryKeys";

const getResource = (payload, resourceKey) =>
  payload?.[resourceKey] ?? payload?.data ?? payload ?? null;

const invalidate = (queryClient, queryKey) =>
  queryClient.invalidateQueries({ queryKey });

const useCreateResourceMutation = ({ mutationFn, listKey }) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn,
    onSuccess: () => invalidate(queryClient, listKey),
  });
};

const useDeleteResourceMutation = ({ mutationFn, listKey }) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn,
    onSuccess: () => invalidate(queryClient, listKey),
  });
};

const useUpdateResourceMutation = ({
  mutationFn,
  listKey,
  detailKey,
  resourceKey,
}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn,
    onSuccess: (payload, variables) => {
      const resource = getResource(payload, resourceKey);
      if (resource && variables?.id) {
        queryClient.setQueryData(detailKey(variables.id), resource);
      }
      invalidate(queryClient, listKey);
    },
  });
};

export const useLoginMutation = () =>
  useMutation({
    mutationFn: ({ identifier, password }) => login(identifier, password),
  });

export const useCreateDomaineMutation = () =>
  useCreateResourceMutation({
    mutationFn: createDomaine,
    listKey: queryKeys.domaines.lists(),
  });

export const useUpdateDomaineMutation = () =>
  useUpdateResourceMutation({
    mutationFn: ({ id, data }) => updateDomaine(id, data),
    listKey: queryKeys.domaines.lists(),
    detailKey: queryKeys.domaines.detail,
    resourceKey: "domaine",
  });

export const useDeleteDomaineMutation = () =>
  useDeleteResourceMutation({
    mutationFn: deleteDomaine,
    listKey: queryKeys.domaines.lists(),
  });

export const useCreateMentionMutation = () =>
  useCreateResourceMutation({
    mutationFn: createMention,
    listKey: queryKeys.mentions.lists(),
  });

export const useUpdateMentionMutation = () =>
  useUpdateResourceMutation({
    mutationFn: ({ id, data }) => updateMention(id, data),
    listKey: queryKeys.mentions.lists(),
    detailKey: queryKeys.mentions.detail,
    resourceKey: "mention",
  });

export const useDeleteMentionMutation = () =>
  useDeleteResourceMutation({
    mutationFn: deleteMention,
    listKey: queryKeys.mentions.lists(),
  });

export const useCreateParcoursMutation = () =>
  useCreateResourceMutation({
    mutationFn: createParcours,
    listKey: queryKeys.parcours.lists(),
  });

export const useUpdateParcoursMutation = () =>
  useUpdateResourceMutation({
    mutationFn: ({ id, data }) => updateParcours(id, data),
    listKey: queryKeys.parcours.lists(),
    detailKey: queryKeys.parcours.detail,
    resourceKey: "parcours",
  });

export const useDeleteParcoursMutation = () =>
  useDeleteResourceMutation({
    mutationFn: deleteParcours,
    listKey: queryKeys.parcours.lists(),
  });

export const useCreateSerieMutation = () =>
  useCreateResourceMutation({
    mutationFn: createSerie,
    listKey: queryKeys.series.lists(),
  });

export const useUpdateSerieMutation = () =>
  useUpdateResourceMutation({
    mutationFn: ({ id, data }) => updateSerie(id, data),
    listKey: queryKeys.series.lists(),
    detailKey: queryKeys.series.detail,
    resourceKey: "serie",
  });

export const useDeleteSerieMutation = () =>
  useDeleteResourceMutation({
    mutationFn: deleteSerie,
    listKey: queryKeys.series.lists(),
  });

export const useCreateMetierMutation = () =>
  useCreateResourceMutation({
    mutationFn: createMetier,
    listKey: queryKeys.metiers.lists(),
  });

export const useUpdateMetierMutation = () =>
  useUpdateResourceMutation({
    mutationFn: ({ id, data }) => updateMetier(id, data),
    listKey: queryKeys.metiers.lists(),
    detailKey: queryKeys.metiers.detail,
    resourceKey: "metier",
  });

export const useDeleteMetierMutation = () =>
  useDeleteResourceMutation({
    mutationFn: deleteMetier,
    listKey: queryKeys.metiers.lists(),
  });

export const useCreateEtablissementMutation = () =>
  useCreateResourceMutation({
    mutationFn: createEtablissement,
    listKey: queryKeys.etablissements.lists(),
  });

export const useUpdateEtablissementMutation = () =>
  useUpdateResourceMutation({
    mutationFn: ({ id, data }) => updateEtablissement(id, data),
    listKey: queryKeys.etablissements.lists(),
    detailKey: queryKeys.etablissements.detail,
    resourceKey: "etablissement",
  });

export const useDeleteEtablissementMutation = () =>
  useDeleteResourceMutation({
    mutationFn: deleteEtablissement,
    listKey: queryKeys.etablissements.lists(),
  });

export const useCreateUserMutation = () =>
  useCreateResourceMutation({
    mutationFn: createUser,
    listKey: queryKeys.users.lists(),
  });

export const useUpdateUserMutation = () =>
  useUpdateResourceMutation({
    mutationFn: ({ id, data }) => updateUser(id, data),
    listKey: queryKeys.users.lists(),
    detailKey: queryKeys.users.detail,
    resourceKey: "utilisateur",
  });

export const useToggleUserStatusMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, isActive }) => toggleUserStatus(id, isActive),
    onSuccess: (payload, variables) => {
      const user = getResource(payload, "utilisateur");
      if (user && variables?.id) {
        queryClient.setQueryData(queryKeys.users.detail(variables.id), user);
      }
      invalidate(queryClient, queryKeys.users.lists());
    },
  });
};

export const useResetUserPasswordMutation = () =>
  useMutation({
    mutationFn: ({ id, password }) => resetUserPassword(id, password),
  });

export const useDeleteUserMutation = () =>
  useDeleteResourceMutation({
    mutationFn: deleteUser,
    listKey: queryKeys.users.lists(),
  });

export const useUpdateProfileMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateProfile,
    onSuccess: (payload) => {
      const user = getResource(payload, "utilisateur");
      queryClient.setQueryData(queryKeys.profile.detail(), user);
      invalidate(queryClient, queryKeys.profile.all);
    },
  });
};

export const useChangePasswordMutation = () =>
  useMutation({
    mutationFn: ({ currentPassword, newPassword }) =>
      changePassword(currentPassword, newPassword),
  });
