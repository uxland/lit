import {IRegion} from './region';

export type ViewFactory = () => Promise<HTMLElement>;
export interface ViewDefinition {
  htmlTag?: string;
  htmlUrl?: string;
  factory?: ViewFactory;
  element?: HTMLElement;
  options?: any;
  isDefault?: boolean;
  removeFromDomWhenDeactivated?: boolean;
  sortHint?: string;
}
export interface ViewComponent {
  view: ViewDefinition;
  viewKey: string;
  region: IRegion;
  active: boolean;
  regionContext: any;
}

export interface RegisteredViews {
  region: string;
  key: string;
  view: ViewDefinition;
  defer?: boolean;
}
