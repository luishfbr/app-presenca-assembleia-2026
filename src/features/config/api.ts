import { axiosClient } from "@/lib/axios-client";
import type { GetSiteConfigResponse } from "./types";
import type { UpdateConfigType } from "./validations";

export const configApi = {
  get: () =>
    axiosClient
      .get<GetSiteConfigResponse>("/admin/presences/config")
      .then((r) => r.data),

  update: (body: UpdateConfigType) =>
    axiosClient
      .patch<GetSiteConfigResponse>("/admin/presences/config", body)
      .then((r) => r.data),

  uploadImage: (field: "background" | "loading", file: File) => {
    const fd = new FormData();
    fd.append("file", file);
    fd.append("field", field);
    return axiosClient
      .post<{ data: { url: string } }>("/admin/presences/config/upload", fd, {
        headers: { "Content-Type": undefined },
      })
      .then((r) => r.data);
  },
};
