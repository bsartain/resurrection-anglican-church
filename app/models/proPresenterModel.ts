export interface ProPresenterSlide {
  slideEnabled: boolean;
  slideNotes: string;
  slideAttachmentMask: number;
  slideText: string;
  slideImage: string;
  slideIndex: string;
  slideTransitionType: number;
  slideLabel: string;
  slideColor: string;
}

export interface ProPresenterSlideGroup {
  groupsummary: string;
  groupColor: string;
  groupSlides: ProPresenterSlide[];
}

export interface ProPresenterPresentation {
  presentationsummary: string;
  presentationHasTimeline: number;
  presentationDestination: number;
  presentationCurrentLocation: string;
  presentationSlideGroups: ProPresenterSlideGroup[];
}

export interface ProPresenterData {
  action: string;
  presentationPath: string;
  presentation: ProPresenterPresentation;
}
