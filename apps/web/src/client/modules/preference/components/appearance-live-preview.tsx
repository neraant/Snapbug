import { Column } from "@workspace/design-system/components/layout/column";
import { Row } from "@workspace/design-system/components/layout/row";
import { Badge } from "@workspace/design-system/components/ui/badge";
import { Button } from "@workspace/design-system/components/ui/button";
import { Panel } from "@workspace/design-system/components/ui/panel";
import { Table } from "@workspace/design-system/components/ui/table";
import { Typography } from "@workspace/design-system/components/ui/typography";
import type { UserPreferenceModelType } from "@workspace/validation/modules/preference/dto/user-preference.model";

import { texts } from "@/client/modules/preference/consts/texts.const";

type AppearanceLivePreviewProps = {
  preference: Pick<UserPreferenceModelType, "density">;
};

export function AppearanceLivePreview({ preference }: AppearanceLivePreviewProps) {
  return (
    <Panel className="hidden lg:flex lg:flex-col">
      <Panel.Header title={texts.preview.title} description={texts.preview.description} />
      <Panel.Content gap="md">
        <Column
          gap="md"
          width="full"
          data-density={preference.density}
          className="rounded-lg border border-border bg-background p-3"
        >
          <Table>
            <Table.Body>
              <Table.Row>
                <Table.Cell>
                  <Row gap="sm" align="center">
                    <Badge variant="outline">{texts.preview.ticketMeta}</Badge>
                    <Typography variant="text-sm" weight="medium">
                      {texts.preview.ticketTitle}
                    </Typography>
                  </Row>
                </Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>
          <Button type="button" className="w-fit">
            {texts.preview.button}
          </Button>
        </Column>
      </Panel.Content>
    </Panel>
  );
}
