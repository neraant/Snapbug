import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@workspace/design-system/components/ui/toast";
import { getAppErrorMessage } from "@workspace/server/error/get-app-error-message";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";

import { organizationRetentionDayOptions } from "@/client/modules/organization/consts/organization-retention-day.const";
import { texts } from "@/client/modules/organization/consts/texts.const";
import {
  organizationSettingsSchema,
  type OrganizationSettingsSchemaType,
} from "@/client/modules/organization/schemas/organization-settings.schema";
import { useActiveOrganizationId } from "@/client/modules/shared/hooks/use-active-organization-id";
import { useFindOrganizations } from "@/client/modules/shared/queries/use-find-organizations";
import { useUpdateOrganization } from "@/client/modules/shared/queries/use-update-organization";

type UseOrganizationSettingsFormInput = {
  onDirtyChange?: (dirty: boolean) => void;
};

export function useOrganizationSettingsForm({ onDirtyChange }: UseOrganizationSettingsFormInput = {}) {
  const activeOrganizationId = useActiveOrganizationId();
  const { data: organizations } = useFindOrganizations();
  const organization =
    organizations.find((item) => item.organizationId === activeOrganizationId) ?? organizations[0] ?? null;
  const { mutateAsync: updateOrganization, isPending } = useUpdateOrganization();
  const [savedVisible, setSavedVisible] = useState(false);

  const { control, handleSubmit, reset, formState } = useForm<OrganizationSettingsSchemaType>({
    resolver: zodResolver(organizationSettingsSchema),
    defaultValues: {
      name: organization?.name ?? "",
      reportsRetentionDays: organization ? String(organization.reports_retention_days) : "",
    },
  });

  useEffect(() => {
    if (!organization) return;

    reset({
      name: organization.name,
      reportsRetentionDays: String(organization.reports_retention_days),
    });
  }, [organization, reset]);

  useEffect(() => {
    onDirtyChange?.(formState.isDirty);
  }, [formState.isDirty, onDirtyChange]);

  const retentionOptions = useMemo(() => {
    const currentDays = organization?.reports_retention_days;
    const values = new Set<string>(organizationRetentionDayOptions.map(String));

    if (currentDays != null && !values.has(String(currentDays))) {
      values.add(String(currentDays));
    }

    return [...values]
      .map((value) => Number(value))
      .sort((left, right) => left - right)
      .map((days) => ({
        value: String(days),
        label: texts.retention.days(days),
      }));
  }, [organization?.reports_retention_days]);

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
      setSavedVisible(true);
    } catch (error) {
      toast.add({
        title: getAppErrorMessage(error, texts.toast.error),
        type: "error",
      });
    }
  });

  const resetToSaved = useCallback(() => {
    if (!organization) return;

    reset({
      name: organization.name,
      reportsRetentionDays: String(organization.reports_retention_days),
    });
    setSavedVisible(false);
  }, [organization, reset]);

  return {
    control,
    onSubmit,
    saving: isPending,
    isDirty: formState.isDirty,
    savedVisible,
    setSavedVisible,
    resetToSaved,
    retentionOptions,
    organization,
  };
}