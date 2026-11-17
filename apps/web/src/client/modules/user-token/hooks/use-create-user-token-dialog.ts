import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@workspace/design-system/components/ui/toast";
import { getAppErrorMessage } from "@workspace/server/error/get-app-error-message";
import {
  expandMcpScopes,
  type McpToolScopeType,
  presetScopes,
  type UserTokenScopePresetType,
} from "@workspace/validation/modules/user-token/consts/mcp-scope.const";
import { createUserTokenInputDtoSchema } from "@workspace/validation/modules/user-token/dto/create-user-token.schema";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";

import { useCreateUserToken } from "@/client/modules/shared/queries/use-create-user-token";
import { useFindProjects } from "@/client/modules/shared/queries/use-find-projects";
import { texts } from "@/client/modules/user-token/consts/texts.const";
import { countTokenTools } from "@/client/modules/user-token/utils/count-token-tools.util";

type CreateUserTokenFormSchemaType = z.infer<typeof createUserTokenInputDtoSchema>;

export function useCreateUserTokenDialog() {
  const [open, setOpen] = useState(false);
  const [secret, setSecret] = useState<string | null>(null);
  const [createdTokenName, setCreatedTokenName] = useState<string | null>(null);
  const [preset, setPreset] = useState<UserTokenScopePresetType>("readOnly");
  const [customScopes, setCustomScopes] = useState<McpToolScopeType[]>([]);
  const [projectMode, setProjectMode] = useState<"all" | "selected">("all");
  const [selectedProjectIds, setSelectedProjectIds] = useState<string[]>([]);
  const { data: projects = [] } = useFindProjects();
  const { mutateAsync: createUserToken, isPending } = useCreateUserToken();
  const { control, handleSubmit, formState, reset } = useForm<CreateUserTokenFormSchemaType>({
    resolver: zodResolver(createUserTokenInputDtoSchema),
    defaultValues: { name: "" },
  });

  const effectiveScopes = useMemo(() => {
    if (preset === "custom") return expandMcpScopes(customScopes);
    return expandMcpScopes(presetScopes(preset));
  }, [customScopes, preset]);

  const toolSummary = useMemo(() => {
    const { allowed, total } = countTokenTools(effectiveScopes);
    return texts.create.dialog.toolSummary(allowed, total);
  }, [effectiveScopes]);

  const onOpenCreate = () => {
    setOpen(true);
    setSecret(null);
    setCreatedTokenName(null);
    setPreset("readOnly");
    setCustomScopes([]);
    setProjectMode("all");
    setSelectedProjectIds([]);
    reset();
  };

  const onPresetChange = (nextPreset: UserTokenScopePresetType) => {
    setPreset(nextPreset);
    if (nextPreset !== "custom") {
      setCustomScopes([]);
    }
  };

  const onToggleScope = (scope: McpToolScopeType, checked: boolean) => {
    setPreset("custom");
    setCustomScopes((current) => {
      const next = new Set(current);
      if (checked) next.add(scope);
      else next.delete(scope);
      return [...next];
    });
  };

  const onToggleProject = (projectId: string, checked: boolean) => {
    setSelectedProjectIds((current) => {
      if (checked) return [...new Set([...current, projectId])];
      return current.filter((id) => id !== projectId);
    });
  };

  const onSubmit = handleSubmit(async (values) => {
    try {
      const scopes = preset === "custom" ? customScopes : undefined;
      const projectIds = projectMode === "all" ? null : selectedProjectIds;
      const created = await createUserToken({
        name: values.name,
        preset,
        scopes,
        projectIds,
      });
      setCreatedTokenName(values.name.trim() || null);
      setSecret(created.secret);
      reset();
    } catch (error) {
      toast.add({
        title: getAppErrorMessage(error, texts.create.error),
        type: "error",
      });
    }
  });

  const onOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) {
      setSecret(null);
      setCreatedTokenName(null);
      reset();
    }
  };

  return {
    control,
    onSubmit,
    open,
    secret,
    createdTokenName,
    isPending: formState.isSubmitting || isPending,
    onOpenChange,
    onOpenCreate,
    preset,
    customScopes,
    projectMode,
    selectedProjectIds,
    projects,
    toolSummary,
    onPresetChange,
    onToggleScope,
    onProjectModeChange: setProjectMode,
    onToggleProject,
  };
}
