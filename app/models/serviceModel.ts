// A single Planning Center service item (one row in the Sunday liturgy).
export interface ServiceDataModel {
  created_at: string;
  custom_arrangement_sequence?: any;
  custom_arrangement_sequence_full?: any;
  custom_arrangement_sequence_short?: any;
  description?: any;
  html_details?: any;
  item_type: string;
  key_name: string;
  length: number;
  sequence: number;
  service_position: string;
  title: string;
  updated_at: string;
}

// A service item after async Bible/Psalter lookups have been resolved to
// renderable content. `resolvedHtml` is either an HTML string or, for the
// Psalter, an array of verse objects.
export interface ResolvedServiceDataModel extends ServiceDataModel {
  resolvedHtml: any;
}
