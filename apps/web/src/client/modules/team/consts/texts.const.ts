import { UserRole } from "@workspace/validation/modules/user/consts/user-role.const";

export const texts = {
  title: "Team",
  invite: {
    action: "Invite people",
    title: "Invite people",
    description: "Send email invitations to people you want to add to your team.",
    fieldLabel: "Email addresses",
    placeholder: "name@company.com",
    hint: "Press Enter or type a comma after each email address.",
    removeEmail: (email: string) => `Remove ${email}`,
    cancel: "Cancel",
    submit: "Send invitations",
    validationError: "Add between 1 and 10 valid email addresses.",
    success: "Invitations sent.",
    error: "Could not send invitations. Try again.",
  },
  search: {
    label: "Search team members",
    placeholder: "Search members",
    clear: "Clear member search",
  },
  column: {
    member: "Member",
    role: "Role",
    assignedOpenTickets: "Assigned open tickets",
    actions: "Actions",
  },
  role: {
    changeLabel: (name: string) => `Change role for ${name}`,
    label: {
      [UserRole.ADMIN]: "Admin",
      [UserRole.USER]: "Member",
    },
    updateError: "Could not update the member role. Try again.",
  },
  action: {
    menu: (name: string) => `Actions for ${name}`,
    editProjectAccess: "Edit project access",
    remove: "Remove",
    removeError: "Could not remove the member. Try again.",
  },
  projectAccess: {
    title: "Edit project access",
    description: (name: string) => `Choose which projects ${name} can access.`,
    adminExplanation: "Admins have access to all projects.",
    empty: "This organization has no projects.",
    project: (name: string) => `Access to ${name}`,
    cancel: "Cancel",
    save: "Save",
    saveError: "Could not update project access. Try again.",
  },
  empty: "No team members match your search.",
} as const;
