export type ResourceCountry =
  | "france"
  | "spain";

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

export type Resource = {
  id: string;

  country: ResourceCountry;

  kind: ResourceKind;

  topics: ResourceTopic[];

  beneficiary: ResourceBeneficiary;

  scope: ResourceScope;

  territories?: string[];

  organization?: string;

  providerType?: ResourceProviderType;

  officialName?: string;

  content: {
    fr: ResourceTranslation;
    es: ResourceTranslation;
  };

  url: string;

  official: boolean;

  featured?: boolean;

  lastVerified?: string;
};

export type ResourceDataset = {
  country: ResourceCountry;

  resources: Resource[];
};