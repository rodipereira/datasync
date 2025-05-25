
import { useEffect } from 'react';
import { analytics } from '@/config/firebase';
import { logEvent, Analytics } from 'firebase/analytics';

export const useFirebaseAnalytics = () => {
  const trackEvent = (eventName: string, parameters?: Record<string, any>) => {
    if (analytics) {
      logEvent(analytics as Analytics, eventName, parameters);
      console.log(`Firebase Analytics: ${eventName}`, parameters);
    }
  };

  const trackPageView = (pageName: string) => {
    trackEvent('page_view', {
      page_title: pageName,
      page_location: window.location.href
    });
  };

  const trackFileUpload = (fileName: string, fileType: string) => {
    trackEvent('file_upload', {
      file_name: fileName,
      file_type: fileType
    });
  };

  const trackDataProcessing = (dataType: 'inventory' | 'employees', recordsCount: number) => {
    trackEvent('data_processing', {
      data_type: dataType,
      records_processed: recordsCount
    });
  };

  return {
    trackEvent,
    trackPageView,
    trackFileUpload,
    trackDataProcessing
  };
};
