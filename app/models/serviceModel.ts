// A single Planning Center service item (one row in the Sunday liturgy).
interface Song {
  links: Links;
  data: Data;
}

interface Data {
  type: string;
  id: string;
}

interface Links {
  related: string;
}

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
  song: Song;
}

// A service item after async Bible/Psalter lookups have been resolved to
// renderable content. `resolvedHtml` is either an HTML string or, for the
// Psalter, an array of verse objects.
export interface ResolvedServiceDataModel extends ServiceDataModel {
  resolvedHtml: any;
  // Stable, shareable DOM id (e.g. "confession") used for deep links and for
  // the reader's active-section tracking.
  slug: string;
  // Table-of-contents label; disambiguated by ordinal when a plan repeats a title.
  label: string;
  // Set when a scripture lookup failed, so one bad reference degrades to a note
  // instead of taking down the whole service.
  readingUnavailable?: boolean;
  // Plain-text reference to fall back on when the lookup failed.
  referenceText?: string;
}
