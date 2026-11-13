import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@workspace/design-system/components/ui/toast";
import { getAppErrorMessage } from "@workspace/server/error/get-app-error-message";
import { useForm } from "react-hook-form";

import { texts } from "@/client/modules/organization/consts/texts.const";
import {
  organizationSettingsSchema,
  type OrganizationSettingsSchemaType,
} from "@/client/modules/organization/schemas/organization-settings.schema";
import { useActiveOrganizationId } from "@/client/modules/shared/hooks/use-active-organization-id";
import { useFindOrganizations } from "@/client/modules/shared/queries/use-find-organizations";
import { useUpdateOrganization } from "@/client/modules/shared/queries/use-update-organization";

export function useOrganizationSettingsForm() {
  const activeOrganizationId = useActiveOrganizationId();
  const { data: organizations } = useFindOrganizations();
  const organization =
    organizations.find((item) => item.organizationId === activeOrganizationId) ?? organizations[0] ?? null;
  const { mutateAsync: updateOrganization, isPending } = useUpdateOrganization();
  const { control, handleSubmit, reset } = useForm<OrganizationSettingsSchemaType>({
    resolver: zodResolver(organizationSettingsSchema),
    defaultValues: {
      name: organization?.name ?? "",
      reportsRetentionDays: organization ? String(organization.reports_retention_days) : "",
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    if (!organization) return;

    try {
      const updated = await updateOrganization({
        organizationId: organization.organizationId,
        name: values.name,
        reports_retention_days: Number(values.reportsRetentionDays),
      });
      reset({
        name: updated.name,
        reportsRetentionDays: String(updated.reports_retention_days),
      });
      toast.add({ title: texts.toast.success, type: "success" });
    } catch (error) {
      toast.add({
        title: getAppErrorMessage(error, texts.toast.error),
        type: "error",
      });
    }
  });

  return { control, onSubmit, saving: isPending };
}
