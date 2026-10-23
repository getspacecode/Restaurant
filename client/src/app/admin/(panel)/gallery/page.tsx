"use client";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { Button, Field, Input, Photo, Section, Select } from "@/components/ui";
import { GalleryCategory, GalleryImage } from "@/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { galleryService } from "@/api/gallery";
import { queryKeys } from "@/lib/queryKeys";
import { refresh } from "@/lib/api";
const CATEGORIES = [
  "Food",
  "Kitchen",
  "Catering",
  "Events",
  "Team",
  "Restaurant",
  "Other",
];
export type GalleryInput = {
  caption: string;
  image: File | null;
  category: string;
};
export default function GalleryAdminPage() {
  const [form, setForm] = useState<GalleryInput>({
    image: null,
    caption: "",
    category: "Food",
  });
  const saveGallery = useMutation({
    mutationFn: () => galleryService.save(form),
    mutationKey: queryKeys.galleries,
    onError: (e) => console.log(e),
    onSuccess: () => refresh(queryKeys.galleries),
  });
  const {
    data: galleries,
    error: galleriesError,
    isLoading: galleriesLoading,
  } = useQuery({
    queryKey: queryKeys.galleries,
    queryFn: galleryService.getAll,
  });
  const deleteGallery = useMutation({
    mutationFn: (id: number) => galleryService.delete(id),
    mutationKey: queryKeys.galleries,
    onSuccess: () => refresh(queryKeys.galleries),
  });
  return (
    <div className="flex flex-col gap-10">
      <Section title="Add new image">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            saveGallery.mutate();
          }}
          className="flex flex-col gap-8"
        >
          <Field label="Type a caption">
            <Input
              type="text"
              onChange={(e) => setForm({ ...form, caption: e.target.value })}
            />
          </Field>
          <Field label="Image (only first image will be used.)">
            <label className="flex h-10 cursor-pointer items-center overflow-hidden rounded-md border border-border bg-field transition-colors hover:border-primary">
              <span className="flex h-full items-center border-r border-border bg-raised px-3 text-sm font-medium text-fg">
                Choose image
              </span>

              <Input
                type="file"
                onChange={(e) => {
                  const files = e.currentTarget.files;

                  if (!files || files.length === 0) return;

                  setForm({
                    ...form,
                    image: files[0],
                  });
                }}
                accept="image/*"
                className="hidden"
              />
            </label>
          </Field>
          <Field label="Category">
            <Select
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            >
              {CATEGORIES.map((c, i) => (
                <option value={c} key={i}>
                  {c}
                </option>
              ))}
            </Select>
          </Field>
          <div className="w-full flex justify-center">
            <Button variant="primary" className="w-max p-4 px-16" type="submit">
              Add
            </Button>
          </div>
        </form>
      </Section>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {galleries?.map((img) => (
          <div key={img.id}>
            <div className="aspect-square overflow-hidden rounded-2xl">
              {img.image && <Photo src={img.image} alt={img.caption} />}
            </div>
            <div className="mt-2 flex items-center justify-between gap-2">
              <span className="truncate text-sm">{img.caption}</span>
              <Button
                variant="ghost"
                size="sm"
                aria-label="Delete"
                onClick={() => {
                  deleteGallery.mutate(Number(img.id));
                }}
              >
                <Trash2 size={16} />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
