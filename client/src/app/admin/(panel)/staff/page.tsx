"use client";
import { useState } from "react";
import { TableWrap, Td, Th } from "@/components/admin-shared";
import { Modal } from "@/components/modal";
import {
  Button,
  Field,
  Input,
  Pill,
  PillKind,
  Section,
  Select,
} from "@/components/ui";
import { useToast } from "@/lib/toast";
import type { Staff, StaffRole } from "@/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { StaffChangeInput, StaffInput, staffService } from "@/api/staff";
import { queryKeys } from "@/lib/queryKeys";
import { log } from "console";
import { refresh } from "@/lib/api";

const emptyForm = {
  name: "",
  username: "",
  password: "",
  role: "Owner",
};
export function formatDateTime(dateTime: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(dateTime));
}
const ROLE_PILLS: Record<StaffRole, PillKind> = {
  Owner: "owner",
  Manager: "manager",
  Chef: "chef",
  Waiter: "waiter",
  Cashier: "cashier",
  Cook: "cook",
};
const ROLES: StaffRole[] = [
  "Owner",
  "Manager",
  "Chef",
  "Waiter",
  "Cashier",
  "Cook",
];
export function capitalizeFirst(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
}
export default function StaffPage() {
  const toast = useToast();
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState<Staff | null>(null);

  const addStaff = useMutation({
    mutationFn: (input: StaffInput) => staffService.save(input),
    mutationKey: queryKeys.staffs,
    onError: (e) => console.log(e),
    onSuccess: () => refresh(queryKeys.staffs),
  });
  const { data: staffs, error } = useQuery({
    queryKey: queryKeys.staffs,
    queryFn: staffService.all,
  });
  const changeStaff = useMutation({
    mutationKey: queryKeys.staffs,
    mutationFn: ({ input, id }: { input: StaffChangeInput; id: string }) =>
      staffService.change(input, id),
    onError: (e) => console.log(e),
    onSuccess: () => refresh(queryKeys.staffs),
  });
  const deleteStaff = useMutation({
    mutationFn: (id: string) => staffService.delete(id),
    mutationKey: queryKeys.staffs,
    onSuccess: () => refresh(queryKeys.staffs),
    onError: (e) => console.log(e),
  });
  function saveEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editing) return;
    const name = editing.name.trim();
    const username = editing.username.trim();
    if (!name || !username)
      return toast("Name and username are required", "error");
    setEditing(null);
    toast("Changes saved");
  }
  return (
    <main className="flex flex-col gap-4">
      <Section title="Add new staff member">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const payload: StaffInput = {
              ...form,
              role: form.role.toUpperCase() as StaffRole,
            };
            addStaff.mutate(payload);
            setForm(emptyForm);
            toast("Employee added successfully.");
          }}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:items-end"
        >
          <Field label="Name">
            <Input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </Field>
          <Field label="Username">
            <Input
              type="text"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
            />
          </Field>
          <Field label="Password">
            <Input
              type="text"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </Field>
          <Field label="Role">
            <Select
              value={form.role}
              onChange={(e) =>
                setForm({ ...form, role: e.target.value as Staff["role"] })
              }
            >
              {ROLES.map((r) => (
                <option value={r} key={r}>
                  {r}
                </option>
              ))}
            </Select>
          </Field>
          <Button type="submit">Add</Button>
        </form>
      </Section>

      <TableWrap>
        <thead>
          <tr>
            <Th>Name</Th>
            <Th>Username</Th>
            <Th>Role</Th>
            <Th>Last login</Th>
            <Th />
          </tr>
        </thead>
        <tbody>
          {staffs?.map((s) => (
            <tr key={s.username}>
              <Td className="font-semibold">{s.name}</Td>
              <Td>{s.username}</Td>
              <Td>
                <Pill kind={ROLE_PILLS[capitalizeFirst(s.role) as StaffRole]}>
                  {capitalizeFirst(s.role)}
                </Pill>
              </Td>

              <Td className="text-muted">{formatDateTime(s.createdAt)}</Td>
              <Td className="text-right">
                <Button
                  variant="light"
                  className="mr-3"
                  size="sm"
                  onClick={() => {
                    setEditing(s);
                  }}
                >
                  Edit
                </Button>
                <Button
                  onClick={() => deleteStaff.mutate(s.id)}
                  variant="danger"
                  size="sm"
                >
                  Delete
                </Button>
              </Td>
            </tr>
          ))}
        </tbody>
      </TableWrap>

      <Modal
        open={!!editing}
        onClose={() => setEditing(null)}
        title="Edit staff member"
      >
        {editing && (
          <form onSubmit={saveEdit} className="flex flex-col gap-4">
            <Field label="Name">
              <Input
                type="text"
                value={editing.name}
                onChange={(e) =>
                  setEditing({ ...editing, name: e.target.value })
                }
              />
            </Field>
            <Field label="Username">
              <Input
                type="text"
                value={editing.username}
                onChange={(e) =>
                  setEditing({ ...editing, username: e.target.value })
                }
              />
            </Field>
            <Field label="Role">
              <Select
                value={editing.role}
                onChange={(e) =>
                  setEditing({
                    ...editing,
                    role: e.target.value as Staff["role"],
                  })
                }
              >
                {ROLES.map((r) => (
                  <option value={r} key={r}>
                    {r}
                  </option>
                ))}
              </Select>
            </Field>
            <div className="mt-2 flex justify-end gap-3">
              <Button variant="ghost" onClick={() => setEditing(null)}>
                Cancel
              </Button>
              <Button
                type="submit"
                onClick={() => {
                  changeStaff.mutate({
                    input: {
                      name: editing.name,
                      role: editing.role.toUpperCase(),
                      username: editing.username,
                    },
                    id: editing.id,
                  });
                }}
              >
                Save
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </main>
  );
}
