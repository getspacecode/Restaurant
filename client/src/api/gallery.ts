import { GalleryInput } from "@/app/admin/(panel)/gallery/page";
import { gql } from "@/lib/api";
import { toDataUrl } from "./menu";
import { GalleryImage } from "@/types";

export const galleryService = {
  save: async (data: GalleryInput) =>
    gql(`mutation ($input: GalleryInput!) { createGallery(input: $input) }`, {
      input: {
        ...data,
        category: data.category.toUpperCase(),
        image: data.image ? await toDataUrl(data.image) : null,
      },
    }),
  getAll: async () =>
    (
      await gql<{ galleries: GalleryImage[] }>(`
    {
     galleries {
       id
       caption 
       category 
       image
     } 
    }
  `)
    ).galleries,
  delete: (id: number) =>
    gql(`mutation ($id: Int!) { deleteGallery(id: $id)}`, {
      id,
    }),
};
