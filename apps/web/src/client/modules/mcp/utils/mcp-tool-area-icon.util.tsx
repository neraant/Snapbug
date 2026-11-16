import type { McpToolAreaType } from "@workspace/validation/modules/mcp/dto/list-tools.schema";
import {
  ActivityIcon,
  BarChart3Icon,
  FolderKanbanIcon,
  type LucideIcon,
  MessageSquareTextIcon,
  SearchIcon,
  TicketIcon,
  UsersIcon,
} from "lucide-react";

const iconsByArea: Record<McpToolAreaType, LucideIcon> = {
  tickets: TicketIcon,
  comments: MessageSquareTextIcon,
  projects: FolderKanbanIcon,
  members: UsersIcon,
  overview: BarChart3Icon,
  search: SearchIcon,
  activity: ActivityIcon,
};

export function getMcpToolAreaIcon(area: McpToolAreaType): LucideIcon {
  return iconsByArea[area];
}
