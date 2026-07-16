import legacyKnowledgeBase from "../../../server/milo-kb";

export type MiloKnowledgeBaseEntry = {
  module: string | null;
  label: string;
  keywords: string;
  answer: string;
};

type LegacyKnowledgeBaseModule = {
  MILO_KB: MiloKnowledgeBaseEntry[];
};

// The answer library is maintained in one place while the legacy Express
// prototype is retired incrementally. This route never initializes SQLite.
export const miloKnowledgeBase = (
  legacyKnowledgeBase as LegacyKnowledgeBaseModule
).MILO_KB;
