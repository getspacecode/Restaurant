import { gql } from "@/lib/api";
import { Staff, StaffRole } from "@/types";

export type StaffInput = {
  name: string;
  username: string;
  password: string;
  role: StaffRole;
};
export type StaffChangeInput = {
  name: string;
  username: string;
  role: string;
};
export const staffService = {
  save: (input: StaffInput) =>
    gql(`mutation ($input: StaffInput!) { createStaff(input: $input) }`, {
      input,
    }),
  all: async () =>
    (
      await gql<{ staffs: Staff[] }>(`{
    staffs {
      id
      name
      username
      role
      createdAt
    }
  }`)
    ).staffs,
  change: (input: StaffChangeInput, id: String) =>
    gql(
      `mutation ($input: StaffChangeInput!, $id: String!) { changeStaff(input: $input, id:$id)}`,
      {
        input,
        id,
      },
    ),
  delete: (id: string) =>
    gql(`mutation ($id: String!) { deleteStaff(id: $id)}`, {
      id,
    }),
};
