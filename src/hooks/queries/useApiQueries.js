import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getDashboardData } from "../../services/dashboard.services";
import { getAllDomaines, getDomaineById } from "../../services/domaine.services";
import { getAllEtablissements, getEtablissementById } from "../../services/etablissement.services";
import { getAllMentions, getMentionById } from "../../services/mention.services";
import { getAllMetiers, getMetierById } from "../../services/metier.services";
import { getAllParcours, getParcoursById } from "../../services/parcours.services";
import { getProfile, getLocalUser } from "../../services/profile.services";
import { getAllSeries, getSerieById } from "../../services/serie.services";
import { getAllUsers } from "../../services/user.services";
import { normalizeListParams, queryKeys } from "./queryKeys";

const asArray = (value) => (Array.isArray(value) ? value : []);

const getCollection = (payload, resourceKey) =>
  asArray(payload?.[resourceKey] ?? payload?.data ?? payload);

const getResource = (payload, resourceKey) =>
  payload?.[resourceKey] ?? payload?.data ?? payload ?? null;

const useListQuery = ({
  params = {},
  queryKeyFactory,
  queryFn,
  resourceKey,
  options = {},
}) => {
  const normalizedParams = normalizeListParams(params);

  return useQuery({
    queryKey: queryKeyFactory(normalizedParams),
    queryFn: () => queryFn(normalizedParams),
    placeholderData: keepPreviousData,
    select: (payload) => getCollection(payload, resourceKey),
    ...options,
  });
};

export const useDashboardQuery = (filters, options = {}) => {
  const normalizedFilters = {
    period: filters?.period || "30j",
    startDate: filters?.startDate || "",
    endDate: filters?.endDate || "",
  };

  return useQuery({
    queryKey: queryKeys.dashboard.detail(normalizedFilters),
    queryFn: () =>
      getDashboardData(
        normalizedFilters.period,
        normalizedFilters.startDate,
        normalizedFilters.endDate,
      ),
    refetchInterval: 60 * 1000,
    ...options,
  });
};

export const useDomainesQuery = (params = "", options = {}) =>
  useListQuery({
    params,
    queryKeyFactory: queryKeys.domaines.list,
    queryFn: getAllDomaines,
    resourceKey: "domaines",
    options,
  });

export const useDomaineQuery = (id, options = {}) =>
  useQuery({
    queryKey: queryKeys.domaines.detail(id),
    queryFn: () => getDomaineById(id),
    enabled: Boolean(id),
    select: (payload) => getResource(payload, "domaine"),
    ...options,
  });

export const useMentionsQuery = (params = "", options = {}) =>
  useListQuery({
    params,
    queryKeyFactory: queryKeys.mentions.list,
    queryFn: getAllMentions,
    resourceKey: "mentions",
    options,
  });

export const useMentionQuery = (id, options = {}) =>
  useQuery({
    queryKey: queryKeys.mentions.detail(id),
    queryFn: () => getMentionById(id),
    enabled: Boolean(id),
    select: (payload) => getResource(payload, "mention"),
    ...options,
  });

export const useParcoursQuery = (params = "", options = {}) =>
  useListQuery({
    params,
    queryKeyFactory: queryKeys.parcours.list,
    queryFn: getAllParcours,
    resourceKey: "parcours",
    options,
  });

export const useParcoursDetailQuery = (id, options = {}) =>
  useQuery({
    queryKey: queryKeys.parcours.detail(id),
    queryFn: () => getParcoursById(id),
    enabled: Boolean(id),
    select: (payload) => getResource(payload, "parcours"),
    ...options,
  });

export const useSeriesQuery = (params = "", options = {}) =>
  useListQuery({
    params,
    queryKeyFactory: queryKeys.series.list,
    queryFn: getAllSeries,
    resourceKey: "series",
    options,
  });

export const useSerieQuery = (id, options = {}) =>
  useQuery({
    queryKey: queryKeys.series.detail(id),
    queryFn: () => getSerieById(id),
    enabled: Boolean(id),
    select: (payload) => getResource(payload, "serie"),
    ...options,
  });

export const useMetiersQuery = (params = "", options = {}) =>
  useListQuery({
    params,
    queryKeyFactory: queryKeys.metiers.list,
    queryFn: getAllMetiers,
    resourceKey: "metiers",
    options,
  });

export const useMetierQuery = (id, options = {}) =>
  useQuery({
    queryKey: queryKeys.metiers.detail(id),
    queryFn: () => getMetierById(id),
    enabled: Boolean(id),
    select: (payload) => getResource(payload, "metier"),
    ...options,
  });

export const useEtablissementsQuery = (params = "", options = {}) =>
  useListQuery({
    params,
    queryKeyFactory: queryKeys.etablissements.list,
    queryFn: getAllEtablissements,
    resourceKey: "etablissements",
    options,
  });

export const useEtablissementQuery = (id, options = {}) =>
  useQuery({
    queryKey: queryKeys.etablissements.detail(id),
    queryFn: () => getEtablissementById(id),
    enabled: Boolean(id),
    select: (payload) => getResource(payload, "etablissement"),
    ...options,
  });

export const useUsersQuery = (params = {}, options = {}) =>
  useListQuery({
    params,
    queryKeyFactory: queryKeys.users.list,
    queryFn: getAllUsers,
    resourceKey: "users",
    options,
  });

export const useProfileQuery = (options = {}) =>
  useQuery({
    queryKey: queryKeys.profile.detail(),
    queryFn: getProfile,
    initialData: () => getLocalUser() || undefined,
    select: (payload) => getResource(payload, "utilisateur"),
    ...options,
  });
