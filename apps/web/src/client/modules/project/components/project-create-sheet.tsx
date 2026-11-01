import { ColorField } from "@workspace/design-system/components/forms/color-field";
import { TextField } from "@workspace/design-system/components/forms/text-field";
import { Column } from "@workspace/design-system/components/layout/column";
import { Row } from "@workspace/design-system/components/layout/row";
import { Button } from "@workspace/design-system/components/ui/button";
import { FieldGroup } from "@workspace/design-system/components/ui/field";
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@workspace/design-system/components/ui/sheet";
import { projectColorValues } from "@workspace/validation/shared/project-color.schema";
import { PlusIcon } from "lucide-react";

import { texts } from "@/client/modules/project/consts/texts.const";
import { useCreateProjectForm } from "@/client/modules/project/hooks/use-create-project-form";

type ProjectCreateSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function ProjectCreateSheet({ open, onOpenChange }: ProjectCreateSheetProps) {
  const closeSheet = () => onOpenChange(false);
  const { control, onSubmit, loading } = useCreateProjectForm({ onCreated: closeSheet });

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right">
        <Column as="form" gap="lg" width="full" className="flex h-full min-h-0" onSubmit={onSubmit}>
          <SheetHeader>
            <SheetTitle>{texts.createSheet.title}</SheetTitle>
            <SheetDescription>{texts.createSheet.description}</SheetDescription>
          </SheetHeader>
          <SheetBody>
            <FieldGroup>
              <TextField
                control={control}
                name="name"
                type="text"
                label={texts.createSheet.field.name.label}
                placeholder={texts.createSheet.field.name.placeholder}
              />
              <ColorField
                control={control}
                name="color"
                label={texts.createSheet.field.color.label}
                colors={projectColorValues}
                swatchLabel={texts.createSheet.field.color.swatchLabel}
              />
            </FieldGroup>
          </SheetBody>
          <SheetFooter>
            <Row align="center" gap="sm" justify="end" width="full">
              <Button type="button" variant="outline" onClick={closeSheet} disabled={loading}>
                {texts.createSheet.cancel}
              </Button>
              <Button type="submit" disabled={loading}>
                <PlusIcon />
                {texts.createSheet.submit}
              </Button>
            </Row>
          </SheetFooter>
        </Column>
      </SheetContent>
    </Sheet>
  );
}
