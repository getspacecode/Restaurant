"use client";
import { reservationService } from "@/api/reservation";
import { tableService } from "@/api/table";
import {
  ResStatusPill,
  TableWrap,
  Td,
  Th,
  PageBar,
} from "@/components/admin-shared";
import {
  Button,
  ButtonLink,
  Chip,
  Field,
  Input,
  Pill,
  Section,
  Select,
  Textarea,
} from "@/components/ui";
import { reservations } from "@/data/reservations";
import { refresh } from "@/lib/api";
import { queryKeys } from "@/lib/queryKeys";
import { fmtDate } from "@/lib/utils";
import { DiningTable, Reservation, ReservationStatus } from "@/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Filter, Pen, X } from "lucide-react";
import { title } from "process";
import { useState } from "react";
const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);
const STATUSES = ["pending", "confirmed", "seated", "cancelled"];
const EVENTS = [
  ["DINNER", "Dinner"],
  ["LUNCH", "Lunch"],
  ["BIRTHDAY", "Birthday"],
  ["ANNIVERSARY", "Anniversary"],
  ["CORPORATE", "Corporate"],
];
function ReservationModal({
  r,
  closeModal,
}: {
  r: Reservation | null;
  closeModal: () => void;
}) {
  if (!r) return null;
  return (
    <div
      onClick={closeModal}
      className="absolute flex items-center backdrop-brightness-50 justify-center top-1/2 left-1/2 -translate-x-1/2 z-40 -translate-y-1/2 w-full h-full p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="z-50 max-h-full w-full h-11/12 max-w-2xl overflow-y-auto rounded-2xl bg-raised p-5 sm:p-8"
      >
        <p className="text-sm text-muted">
          In order to close this modal click outside of this card.
        </p>
        <EditForm r={r} closeModal={closeModal} />
      </div>
    </div>
  );
}
function EditForm({
  r,
  closeModal,
}: {
  r: Reservation;
  closeModal: () => void;
}) {
  const [form, setForm] = useState<Reservation>(r);
  const [removedTables, setRemovedTables] = useState<DiningTable[]>([]);
  const [openedTables, setOpenedTables] = useState(false);
  const set = <K extends keyof Reservation>(key: K, value: Reservation[K]) =>
    setForm((f) => ({ ...f, [key]: value }));
  const {
    data: tables,
    error: tablesError,
    isLoading: tablesLoading,
  } = useQuery({
    queryKey: [
      queryKeys.tables,
      form.startDate,
      form.endDate,
      form.startTime,
      form.endTime,
    ],
    queryFn: () =>
      tableService.getActive({
        startDate: r.startDate,
        endDate: r.endDate,
        startTime: r.startTime,
        endTime: r.endTime,
      }),
  });
  const saveReservation = useMutation({
    mutationFn: ({ id, input }: { id: number; input: Reservation }) =>
      reservationService.change(id, input),
    mutationKey: queryKeys.reservations,
    onSuccess: () => refresh(queryKeys.reservations),
  });

  function submit(e: React.FormEvent, id: number) {
    e.preventDefault();

    saveReservation.mutate(
      { id, input: form },
      {
        onError: (e) => console.log(e),
        onSuccess: () => {
          // closeModal();
        },
      },
    );
  }

  return (
    <form onSubmit={(e) => submit(e, r.id ?? 0)} className="mt-4 space-y-3">
      <div className="mb-5">
        <h1 className="font-display text-2xl text-cream sm:text-3xl">
          Editing reservation
        </h1>
        <p className="mt-1 text-sm text-muted">
          {r.customerName}
          {r.id && ` · #${r.id}`}
        </p>
      </div>

      <Section title="Status">
        <div className="flex flex-wrap gap-2">
          {STATUSES.map((s) => (
            <Chip
              key={s}
              active={form.status.toLowerCase() === s}
              onClick={() => set("status", s.toUpperCase())}
            >
              {s[0].toUpperCase() + s.slice(1)}
            </Chip>
          ))}
        </div>
      </Section>

      <Section title="Guest">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Name">
            <Input
              required
              value={form.customerName}
              onChange={(e) => set("customerName", e.target.value)}
            />
          </Field>
          <Field label="Phone">
            <Input
              required
              type="tel"
              value={form.phone}
              onChange={(e) => set("phone", e.target.value)}
            />
          </Field>
          <Field label="Email (optional)" className="sm:col-span-2">
            <Input
              type="email"
              value={form.email ?? ""}
              onChange={(e) => set("email", e.target.value)}
            />
          </Field>
        </div>
      </Section>

      <Section title="Date and time">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Start date">
            <Input
              required
              type="date"
              value={form.startDate}
              onChange={(e) => set("startDate", e.target.value)}
            />
          </Field>
          <Field label="Start time">
            <Input
              required
              type="time"
              value={form.startTime}
              onChange={(e) => set("startTime", e.target.value)}
            />
          </Field>
          <Field label="End date">
            <Input
              type="date"
              value={form.endDate ?? ""}
              onChange={(e) => set("endDate", e.target.value)}
            />
          </Field>
          <Field label="End time">
            <Input
              required
              type="time"
              value={form.endTime}
              onChange={(e) => set("endTime", e.target.value)}
            />
          </Field>
        </div>
      </Section>

      <Section title="Event">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Guests">
            <Input
              required
              type="number"
              min={1}
              value={form.guests}
              onChange={(e) => set("guests", Number(e.target.value))}
            />
          </Field>
          <Field label="Event type">
            <Select
              value={form.event ?? ""}
              onChange={(e) => set("event", e.target.value)}
            >
              <option value="">None</option>
              {EVENTS.map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </Select>
          </Field>
        </div>
      </Section>

      <Section title="Selected Tables">
        <h1 className="text-muted text-xs mb-10">
          Click one of the selected tables to remove it from the list.
        </h1>
        <div className="mb-4 flex flex-wrap items-center gap-2">
          {form.tables?.length ? (
            form.tables.map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  setForm((prev) => ({
                    ...prev,
                    tables: prev.tables?.filter((table) => table.id !== t.id),
                  }));
                  setRemovedTables((prev) => {
                    const existsInAvailableTables = tables?.some(
                      (table) => table.id === t.id,
                    );

                    if (existsInAvailableTables) return prev;

                    return prev.some((table) => table.id === t.id)
                      ? prev
                      : [...prev, t];
                  });
                }}
              >
                <Pill
                  key={t.id}
                  kind="confirmed"
                  className="flex gap-2 hover:bg-deep"
                >
                  <p>
                    Table {t.label} with {t.seats} seats{" "}
                  </p>
                </Pill>
              </button>
            ))
          ) : (
            <span className="text-sm text-muted">No tables assigned</span>
          )}
        </div>
        <Section title="Available tables (click to select)">
          <div className="flex flex-wrap items-center gap-2">
            {[...(tables ?? []), ...removedTables]
              .filter(
                (t) => !form.tables?.some((selected) => selected.id === t.id),
              )
              .map((t) => (
                <button
                  type="button"
                  key={t.id}
                  onClick={() => {
                    setForm((prev) => ({
                      ...prev,
                      tables: [...(prev.tables ?? []), t],
                    }));
                    setRemovedTables((prev) =>
                      prev.filter((table) => table.id !== t.id),
                    );
                  }}
                >
                  <Pill className="hover:bg-primary" kind="dine">
                    Table {t.label} with {t.seats} seats
                  </Pill>
                </button>
              ))}
          </div>
        </Section>
      </Section>
      <Section title="Notes">
        <Textarea
          className="min-h-22.5"
          placeholder="Allergies, cake arrival, special requests..."
          value={form.notes ?? ""}
          onChange={(e) => set("notes", e.target.value)}
        />
      </Section>

      <div className="flex justify-end gap-3 pt-2">
        <Button variant="ghost" onClick={closeModal}>
          Cancel
        </Button>
        <Button type="submit">Save changes</Button>
      </div>
    </form>
  );
}
export default function ReservationsPage() {
  const [modalOpened, setModalOpened] = useState(false);
  const [selectedReservation, setSelectedReservation] =
    useState<Reservation | null>(null);
  const openModal = () => setModalOpened(!modalOpened);
  const {
    data: reservations,
    error,
    isLoading,
  } = useQuery({
    queryKey: queryKeys.reservations,
    queryFn: reservationService.getAll,
  });
  if (error) console.log(error);
  return (
    <>
      <PageBar>
        <ButtonLink href="/admin/reservations/new" variant="gold" size="sm">
          + New reservation
        </ButtonLink>
      </PageBar>
      <TableWrap>
        <thead>
          <tr>
            <Th>Date</Th>
            <Th>Time</Th>
            <Th>Name</Th>
            <Th>Event</Th>
            <Th>Guests</Th>
            <Th>Phone</Th>
            <Th>Status</Th>
            <Th></Th>
          </tr>
        </thead>
        <tbody>
          {reservations?.map((r) => (
            <tr key={r.id}>
              <Td>{fmtDate(r.startDate)}</Td>
              <Td>{r.startTime}</Td>
              <Td className="font-semibold">{r.customerName}</Td>
              <Td>{capitalize(r.event.toLowerCase())}</Td>
              <Td>{r.guests}</Td>
              <Td>{r.phone}</Td>
              <Td>
                <ResStatusPill
                  status={r.status.toLowerCase() as ReservationStatus}
                />
              </Td>
              <Td>
                <Pen
                  className="scale-85 text-muted hover:text-fg cursor-pointer"
                  onClick={() => {
                    openModal();
                    setSelectedReservation(r);
                  }}
                />
              </Td>
            </tr>
          ))}
        </tbody>
      </TableWrap>
      {modalOpened && (
        <ReservationModal
          closeModal={() => openModal()}
          r={selectedReservation}
        />
      )}
    </>
  );
}
