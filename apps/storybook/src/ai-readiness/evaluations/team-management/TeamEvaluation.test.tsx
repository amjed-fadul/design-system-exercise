import { describe, expect, it } from "vitest";
import { filterMembers, type TeamMember } from "./TeamEvaluation";

const members: TeamMember[] = [
  {
    id: "sara",
    name: "Sara Ahmed",
    email: "sara@example.com",
    initials: "SA",
    role: "Member",
    status: "Active",
    kind: "member",
  },
  {
    id: "maya-invitation",
    name: "Has not joined yet",
    email: "maya@example.com",
    initials: "@",
    role: "Member",
    status: "Invitation pending",
    kind: "invitation",
  },
];

describe("filterMembers", () => {
  it("matches active members and invitations by case-insensitive name or email", () => {
    expect(filterMembers(members, "sArA")).toEqual([members[0]]);
    expect(filterMembers(members, "MAYA@EXAMPLE.COM")).toEqual([members[1]]);
    expect(filterMembers(members, "  ")).toEqual(members);
  });
});
