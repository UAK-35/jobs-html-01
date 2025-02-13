export interface ISelectionInfo extends Record<string, any> {
  serviceGroup: string; service: string; quantity: number; quantityText: string; pricePerItem: number
};

export interface ISelectionRecord extends ISelectionInfo {
  id: number;
  price: number;
}

export interface IEjsWebpackParameters {
  filename: string;
  template: string;
  templateParameters: {
    title: string;
    page: string;
  };
}

export interface IEjTemplateInputParameters extends IEjsWebpackParameters {
  templateParameters: {
    title: string;
    page: string;
    viewsFolder: string;
    partialsFolder: string;
  }
}

export interface IWorkDurationType {
  title:           string;
  code:            string;
  descriptiveText: string;
}

export interface IJobType {
  indexPageTitle:       string;
  indexPageDescription: string;
  calculateButtonUrl:   string;
  indexPageOrdering:    number;
  indexPageIcon:        string;
  title:                string;
  value:                string;
}

export interface IReviewStoriesType {
  absoluteLocationClass: string;
  imageFilename: string;
  storyParagraphs: string[];
}

export interface IFaqType {
  question: string
  answer: string
}

export interface IServicesType {
  icon: string
  title: string
  description: string
}

export enum Units {
  P = "p",
  Sqm = "sqm",
  M = "m",
}

export interface IProvidedServicesType {
  title:           string;
  defaultQuantity: number;
  units:           Units;
  pricePounds:     number;
}
