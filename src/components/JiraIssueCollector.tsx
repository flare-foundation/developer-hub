import React, { useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    ATL_JQ_PAGE_PROPS: any;
    showCollectorDialog: () => void;
  }
}

function IssueCollectorButton() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const buttonRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src =
      'https://flare-network.atlassian.net/s/d41d8cd98f00b204e9800998ecf8427e-T/-vg1gsr/b/8/c95134bc67d3a521bb3f4331beb9b804/_/download/batch/com.atlassian.jira.collector.plugin.jira-issue-collector-plugin:issuecollector/com.atlassian.jira.collector.plugin.jira-issue-collector-plugin:issuecollector.js?locale=en-US&collectorId=426c6341';
    script.async = true;
    document.body.appendChild(script);

    window.ATL_JQ_PAGE_PROPS = {
      triggerFunction: function (showCollectorDialog: () => void) {
        window.showCollectorDialog = showCollectorDialog;
      },
    };

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
        setIsFormOpen(false);
      }
    }

    if (isFormOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isFormOpen]);

  function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();

    if (window.showCollectorDialog) {
      window.showCollectorDialog();
      setIsFormOpen(true);
    } else {
      alert('The JIRA form script has not loaded yet. Please try again in a moment.');
    }
  }

  return (
    <div ref={buttonRef} style={{ display: 'inline-block' }}>
      <button
        type="button"
        onClick={handleClick}
        style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}
      >
        Open Issue Collector
      </button>
    </div>
  );
}

export default IssueCollectorButton;