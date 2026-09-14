export type ResourceCountry =
  | "france"
  | "spain";

export type ResourceLanguage =
  | "fr"
  | "es";


export type ResourceTerritoryLevel =
  | "region"
  | "department"
  | "autonomous-community"
  | "province"
  | "local";

export type ResourceTerritory = {
  id: string;
  country: ResourceCountry;
  level: ResourceTerritoryLevel;
  parentId?: string;
  labels: Record<ResourceLanguage, string>; // une propriété du territoire, pas du pays sélectionné
};

// le type du fichier JSON lui-même dans content/resources/territories.json
export type ResourceTerritoryDataset = {
  territories: ResourceTerritory[]
}

export type TranslationStatus =
  | "original"
  | "draft"
  | "reviewed";

export type ResourceKind =
  | "financial-aid"
  | "service"
  | "institution"
  | "association"
  | "guide"
  | "training"
  | "directory"
  | "tool"
  | "legal-information";

export type ResourceTopic =
  | "financial-support"
  | "rights-procedures"
  | "dependency-disability"
  | "work-leave"
  | "tax-retirement"
  | "respite"
  | "caregiver-health"
  | "psychological-support"
  | "social-support"
  | "daily-life"
  | "care-coordination"
  | "home-care"
  | "accessibility-equipment"
  | "housing-adaptation"
  | "mobility-transport"
  | "teleassistance-safety"
  | "care-skills"
  | "end-of-life";

export type ResourceBeneficiary =
  | "caregiver"
  | "cared-person"
  | "both";

export type ResourceScope =
  | "national"
  | "regional"
  | "departmental"
  | "provincial"
  | "local";

export type ResourceProviderType =
  | "public"
  | "association"
  | "foundation"
  | "healthcare"
  | "private"
  | "other";

export type ResourceTranslation = {
  title: string;
  description: string;
};

export type ResourceContent =
  Partial<
    Record<
      ResourceLanguage,
      ResourceTranslation
    >
  >;

export type ResourceTranslationStatus =
  Partial<
    Record<
      ResourceLanguage,
      TranslationStatus
    >
  >;

export type Resource = {
  id: string;

  country: ResourceCountry;

  sourceLanguage: ResourceLanguage;

  kind: ResourceKind;

  topics: ResourceTopic[];

  beneficiary: ResourceBeneficiary;

  scope: ResourceScope;

  territoryIds?: string[];

  organization?: string;

  providerType?: ResourceProviderType;

  officialName?: string;

  content: ResourceContent;

  translationStatus:
  ResourceTranslationStatus;

  url: string;

  official: boolean;

  featured?: boolean;

  lastVerified?: string;
};

export type ResourceDataset = {
  country: ResourceCountry;

  resources: Resource[];
};