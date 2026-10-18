import { gql } from "@/lib/api";
import { Reservation } from "@/types";

export const reservationService = {
  save: (reservation: Reservation) =>
    gql(
      `mutation ($input: ReservationInput!) { createReservation(input: $input) } `,
      {
        input: reservation,
      },
    ),
  getAll: async () =>
    (
      await gql<{ reservations: Reservation[] }>(`
    {
      reservations {
        id
        startDate
        startTime
        customerName
        event
        guests
        phone
        status
        tables {
          id
          label
          seats
        }
        email
        endDate
        endTime
        notes
      }
    }
  `)
    ).reservations,
  change: (id: number, input: Reservation) =>
    gql<{ changeReservation: boolean }>(
      `mutation ($id: Int!, $input: ReservationInput!) {
      changeReservation(id: $id, input: $input)
    }`,
      {
        id,
        input,
      },
    ),
};
