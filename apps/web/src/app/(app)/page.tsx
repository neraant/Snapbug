import { PageContainer } from "@workspace/design-system/components/layout/page";

import { texts } from "@/client/modules/shared/consts/texts.const";

export default function Page() {
  return <PageContainer title={texts.overview.title} description={texts.overview.description} />;
}
