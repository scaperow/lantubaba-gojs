import { UseFetchOptions } from "#app";
import { KeyOfRes } from "nuxt/dist/app/composables/asyncData";

export function useAPIFetch<T>(request: any, opts?: UseFetchOptions<T extends void ? unknown : T, (res: T extends void ? unknown : T) => T extends void ? unknown : T, KeyOfRes<(res: T extends void ? unknown : T) => T extends void ? unknown : T>> | undefined) {
  const abortController = new AbortController();
  const config = useRuntimeConfig();
  const result = useFetch<T>(request, {
    signal: abortController.signal,
    baseURL: config.public.baseURL,
    headers: {
      Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTY3MDc1MTM4ODIzNzczNDgsIm1haWwiOiJzY2FwZXJvd0Bob3RtYWlsLmNvbSIsInNpZ2luQXMiOiJtYWlsIiwiaWF0IjoxNjcwNzU3OTI3fQ.ttdBleEnwVQ-fN6qmDyrMdrrE_iQwj0WTeJQxCkylEY",
    },
    key: String(new Date().getTime()),
    initialCache: false,
    ...opts,
  });

  setTimeout(() => {
    abortController.abort();
  }, 10000);

  return result;
}
