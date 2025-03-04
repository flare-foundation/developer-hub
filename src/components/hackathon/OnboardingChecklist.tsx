import React, { useState, useEffect } from "react";
import Heading from "@theme/Heading";
import { useColorMode } from "@docusaurus/theme-common";

const CHECKLIST_STEPS = [
  {
    id: "google-account",
    title: "Set up your Google account",
    docSection: "step-1-set-up-your-google-account",
    subSteps: [
      { id: "google-account-create", text: "Have a Google account" },
      {
        id: "google-account-register",
        text: "Submit account during registration (i.e. the Google Form)",
      },
      {
        id: "google-account-access",
        text: "Verify access to `verifiable-ai-hackathon` GCP project",
      },
    ],
  },
  {
    id: "api-credentials",
    title: "Set up API credentials",
    docSection: "step-2-set-up-api-credentials",
    subSteps: [
      { id: "gemini-api-create", text: "Create Gemini API key" },
      { id: "store-api-key", text: "Store API key securely" },
      {
        id: "openrouter-api",
        text: "Set up OpenRouter API (Consensus Learning track only)",
      },
    ],
  },
  {
    id: "gcloud-setup",
    title: "Install & configure gcloud CLI",
    docSection: "step-3-install-configure-gcloud-cli",
    subSteps: [
      { id: "gcloud-install", text: "Install gcloud CLI" },
      { id: "gcloud-auth", text: "Authenticate CLI" },
      {
        id: "gcloud-verify",
        text: "Verify gcloud access to verifiable-ai-hackathon project",
      },
    ],
  },
  {
    id: "track-template",
    title: "Select your track template",
    docSection: "step-4-select-your-track-template",
    subSteps: [
      { id: "tools-install", text: "Install required tools" },
      { id: "repo-template", text: "Choose template repository" },
      { id: "clone-repo", text: "Clone & set up repository" },
    ],
  },
];

const getTotalSteps = () => {
  return CHECKLIST_STEPS.reduce((acc, step) => acc + step.subSteps.length, 0);
};

const getLocalStorageKey = () => "verifiable-ai-hackathon-progress";

const OnboardingChecklist = () => {
  const { colorMode } = useColorMode();
  const isDarkMode = colorMode === "dark";

  // Theme colors based on color mode
  const colors = {
    primary: isDarkMode
      ? "var(--ifm-color-primary)"
      : "var(--ifm-color-primary)",
    primaryLighter: isDarkMode
      ? "var(--ifm-color-primary-lighter)"
      : "var(--ifm-color-primary-lighter)",
    primaryDarker: isDarkMode
      ? "var(--ifm-color-primary-darker)"
      : "var(--ifm-color-primary-darker)",
    primaryLightest: isDarkMode
      ? "var(--ifm-color-primary-lightest)"
      : "var(--ifm-color-primary-lightest)",
    text: isDarkMode ? "#f8f9fa" : "#212529",
    textSecondary: isDarkMode ? "#adb5bd" : "#6c757d",
    background: isDarkMode ? "var(--ifm-background-color)" : "#ffffff",
    cardBackground: isDarkMode ? "var(--ifm-card-background-color)" : "#ffffff",
    border: isDarkMode ? "#495057" : "#dee2e6",
    success: isDarkMode ? "#75b798" : "#198754", // Green
    successLight: isDarkMode
      ? "rgba(117, 183, 152, 0.1)"
      : "rgba(25, 135, 84, 0.1)",
    warning: isDarkMode ? "#ffca2c" : "#ffc107", // Yellow/amber
    warningLight: isDarkMode
      ? "rgba(255, 202, 44, 0.1)"
      : "rgba(255, 193, 7, 0.1)",
    inactive: isDarkMode ? "#6c757d" : "#adb5bd", // Gray
    inactiveLight: isDarkMode
      ? "rgba(108, 117, 125, 0.1)"
      : "rgba(173, 181, 189, 0.1)",
  };

  const [checklist, setChecklist] = useState(() => {
    if (typeof window !== "undefined") {
      const savedProgress = localStorage.getItem(getLocalStorageKey());
      return savedProgress
        ? JSON.parse(savedProgress)
        : CHECKLIST_STEPS.map((step) => ({
            ...step,
            subSteps: step.subSteps.map((subStep) => ({
              ...subStep,
              completed: false,
            })),
          }));
    }
    return CHECKLIST_STEPS.map((step) => ({
      ...step,
      subSteps: step.subSteps.map((subStep) => ({
        ...subStep,
        completed: false,
      })),
    }));
  });

  const [isVisible, setIsVisible] = useState(false);
  const [isMiniView, setIsMiniView] = useState(true);
  const [completedCount, setCompletedCount] = useState(0);
  const [isSticky, setIsSticky] = useState(false);
  const [showAllComplete, setShowAllComplete] = useState(false);

  useEffect(() => {
    // Count completed steps
    const completed = checklist.reduce(
      (acc, step) =>
        acc + step.subSteps.filter((subStep) => subStep.completed).length,
      0,
    );
    setCompletedCount(completed);

    // Check if all steps are completed
    setShowAllComplete(completed === getTotalSteps() && completed > 0);

    // Save to localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem(getLocalStorageKey(), JSON.stringify(checklist));
    }

    // Set up scroll listener for minimizing checklist when scrolling
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      if (scrollPosition > 200) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
        setIsMiniView(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [checklist]);

  const toggleStep = (stepId: string, subStepId: string) => {
    setChecklist((prevChecklist) =>
      prevChecklist.map((step) =>
        step.id === stepId
          ? {
              ...step,
              subSteps: step.subSteps.map((subStep) =>
                subStep.id === subStepId
                  ? { ...subStep, completed: !subStep.completed }
                  : subStep,
              ),
            }
          : step,
      ),
    );
  };

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  const toggleMiniView = () => {
    setIsMiniView(!isMiniView);
  };

  const resetProgress = () => {
    if (window.confirm("Are you sure you want to reset your progress?")) {
      const resetChecklist = CHECKLIST_STEPS.map((step) => ({
        ...step,
        subSteps: step.subSteps.map((subStep) => ({
          ...subStep,
          completed: false,
        })),
      }));
      setChecklist(resetChecklist);
      setShowAllComplete(false);
    }
  };

  const scrollToSection = (sectionId: string) => {
    // Try to find the element by either sectionId or by h2/h3 text content
    let element: HTMLElement | null = document.getElementById(sectionId);

    if (!element) {
      // Try to find via heading text if ID isn't found
      const step = CHECKLIST_STEPS.find(
        (step) => step.docSection === sectionId,
      );

      if (step) {
        // Convert NodeList to Array for TypeScript compatibility
        const headingsArray = Array.from(document.querySelectorAll("h2, h3"));

        for (const heading of headingsArray) {
          if (heading.textContent && heading.textContent.includes(step.title)) {
            // Cast to HTMLElement to fix TypeScript error
            element = heading as HTMLElement;
            break;
          }
        }
      }
    }

    if (element) {
      // Add a slight offset to account for sticky header
      const offset = 120;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });

      // Auto-minimize after clicking
      setIsMiniView(true);
    } else {
      // Fallback method: use textual search across all headings
      const allHeadings = Array.from(
        document.querySelectorAll("h1, h2, h3, h4, h5, h6"),
      );

      // First, check for direct matches with step titles
      for (const step of CHECKLIST_STEPS) {
        const matchingHeading = allHeadings.find(
          (h) =>
            h.textContent &&
            h.textContent.toLowerCase().includes(step.title.toLowerCase()),
        );

        if (matchingHeading && step.docSection === sectionId) {
          const offset = 120;
          const elementPosition = matchingHeading.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - offset;

          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth",
          });

          setIsMiniView(true);
          return;
        }
      }

      // If still no match, try to find by partial match of section number
      const sectionNumber = sectionId.match(/step-(\d+)/);
      if (sectionNumber && sectionNumber[1]) {
        const matchingHeading = allHeadings.find(
          (h) =>
            h.textContent &&
            h.textContent.toLowerCase().includes(`step ${sectionNumber[1]}`),
        );

        if (matchingHeading) {
          const offset = 120;
          const elementPosition = matchingHeading.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - offset;

          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth",
          });

          setIsMiniView(true);
        }
      }
    }
  };

  const getActiveSection = () => {
    if (typeof window !== "undefined") {
      // Try finding by ID first
      for (const step of CHECKLIST_STEPS) {
        const element = document.getElementById(step.docSection);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 150 && rect.bottom > 0) {
            return step.docSection;
          }
        }
      }

      // If not found by ID, try by heading text
      // Convert NodeList to Array for TypeScript compatibility
      const headings = Array.from(document.querySelectorAll("h2, h3"));
      const scrollPosition = window.scrollY + 150; // Add offset for header

      // Map headings to their positions
      const headingPositions = headings.map((heading) => {
        return {
          heading,
          top: heading.getBoundingClientRect().top + window.scrollY,
        };
      });

      // Find the closest heading above current scroll position
      for (let i = headingPositions.length - 1; i >= 0; i--) {
        if (headingPositions[i].top <= scrollPosition) {
          const headingText = headingPositions[i].heading.textContent;
          if (headingText) {
            const matchingStep = CHECKLIST_STEPS.find(
              (step) =>
                headingText.includes(step.title) ||
                step.title.includes(headingText),
            );
            if (matchingStep) {
              return matchingStep.docSection;
            }
          }
        }
      }
    }
    return null;
  };

  const activeSection = getActiveSection();

  // Calculate status for each section
  const stepStatuses = checklist.map((step) => {
    const completedSubSteps = step.subSteps.filter(
      (subStep) => subStep.completed,
    ).length;
    const totalSubSteps = step.subSteps.length;

    return {
      id: step.id,
      docSection: step.docSection,
      title: step.title,
      progress: `${completedSubSteps}/${totalSubSteps}`,
      isComplete: completedSubSteps === totalSubSteps,
      inProgress: completedSubSteps > 0 && completedSubSteps < totalSubSteps,
    };
  });

  const renderMiniView = () => (
    <div
      className="onboarding-miniBar"
      style={{
        position: "fixed",
        top: "5.5rem",
        left: 0,
        right: 0,
        padding: "0.5rem 1rem",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        transition: "transform 0.3s ease",
        zIndex: 999,
        backgroundColor: isDarkMode
          ? colors.primaryDarker
          : colors.primaryLightest,
      }}
    >
      <div
        className="onboarding-miniBarContent"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          maxWidth: "1320px",
          margin: "0 auto",
        }}
      >
        <div
          className="onboarding-miniProgressSection"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
          }}
        >
          <div
            className="onboarding-miniTitle"
            style={{
              fontWeight: 600,
              color: "white",
              whiteSpace: "nowrap",
            }}
          >
            Onboarding Progress
          </div>
          <div
            className="onboarding-miniCounter"
            style={{
              borderRadius: "2rem",
              padding: "0.1rem 0.5rem",
              fontSize: "0.8rem",
              fontWeight: 700,
              whiteSpace: "nowrap",
              backgroundColor: colors.background,
              color: colors.primary,
            }}
          >
            {completedCount}/{getTotalSteps()}
          </div>
        </div>
        <div
          className="onboarding-miniProgressBar"
          style={{
            flexGrow: 1,
            height: "6px",
            backgroundColor: "rgba(255, 255, 255, 0.3)",
            borderRadius: "3px",
            margin: "0 1.5rem",
            overflow: "hidden",
          }}
        >
          <div
            className="onboarding-miniProgressBarFill"
            style={{
              height: "100%",
              width: `${(completedCount / getTotalSteps()) * 100}%`,
              borderRadius: "3px",
              backgroundColor: "white",
              transition: "width 0.5s ease",
            }}
          />
        </div>
        <button
          className="onboarding-miniExpandButton"
          onClick={toggleMiniView}
          aria-label="Expand checklist"
          style={{
            padding: "0.3rem 1rem",
            backgroundColor: "rgba(255, 255, 255, 0.2)",
            color: "white",
            border: "none",
            borderRadius: "3px",
            fontSize: "0.8rem",
            fontWeight: 600,
            cursor: "pointer",
            transition: "background-color 0.2s ease",
          }}
        >
          View Tasks
        </button>
      </div>
    </div>
  );

  return (
    <>
      <div
        className="onboarding-checklistContainer"
        style={{
          position: "relative",
          zIndex: 10,
          margin: "1.5rem 0 2.5rem",
          borderRadius: "var(--ifm-global-radius)",
          boxShadow: "0 4px 16px rgba(0, 0, 0, 0.08)",
          overflow: "hidden",
        }}
      >
        <div
          className="onboarding-checklistHeader"
          style={{
            cursor: "pointer",
            padding: "0.75rem 1rem",
            backgroundColor: isDarkMode
              ? colors.primaryDarker
              : colors.primaryLightest,
          }}
          onClick={toggleVisibility}
        >
          <div
            className="onboarding-headerContent"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "0.5rem",
            }}
          >
            <div
              className="onboarding-titleSection"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
              }}
            >
              <Heading
                as="h3"
                style={{
                  margin: 0,
                  fontSize: "1.1rem",
                  fontWeight: 600,
                  color: "white",
                }}
              >
                Onboarding Progress
              </Heading>
              <div
                className="onboarding-progressCounter"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: colors.background,
                  borderRadius: "2rem",
                  padding: "0.2rem 0.75rem",
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  minWidth: "3rem",
                  color: colors.primary,
                }}
              >
                {completedCount}/{getTotalSteps()}
              </div>
            </div>
            <button
              className="onboarding-toggleButton"
              aria-label={isVisible ? "Collapse checklist" : "Expand checklist"}
              onClick={(e) => {
                e.stopPropagation();
                toggleVisibility();
              }}
              style={{
                background: "none",
                border: "none",
                color: "white",
                fontSize: "1.1rem",
                cursor: "pointer",
                padding: "0.25rem",
                marginLeft: "0.5rem",
                borderRadius: "50%",
                width: "28px",
                height: "28px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {isVisible ? "▼" : "▲"}
            </button>
          </div>

          <div
            className="onboarding-progressBarContainer"
            style={{
              height: "6px",
              backgroundColor: "rgba(255, 255, 255, 0.3)",
              borderRadius: "3px",
              overflow: "hidden",
            }}
          >
            <div
              className="onboarding-progressBarFill"
              style={{
                height: "100%",
                width: `${(completedCount / getTotalSteps()) * 100}%`,
                borderRadius: "3px",
                backgroundColor: "white",
                transition: "width 0.5s ease",
              }}
            />
          </div>
        </div>

        {isVisible && (
          <div
            className="onboarding-checklistBody"
            style={{
              backgroundColor: colors.cardBackground,
            }}
          >
            {showAllComplete && (
              <div
                style={{
                  padding: "1rem",
                  textAlign: "center",
                  backgroundColor: colors.successLight,
                  borderBottom: `1px solid ${colors.border}`,
                }}
              >
                <div
                  style={{
                    fontSize: "1.1rem",
                    fontWeight: 600,
                    color: colors.success,
                    marginBottom: "0.5rem",
                  }}
                >
                  🎉 All Set! You're ready to start building!
                </div>
                <div
                  style={{
                    fontSize: "0.9rem",
                    color: colors.textSecondary,
                  }}
                >
                  Dive into your chosen track and let the hacking begin!
                </div>
              </div>
            )}

            <div
              className="onboarding-checklistContent"
              style={{
                padding: "1rem",
                maxHeight: "50vh",
                overflowY: "auto",
              }}
            >
              {checklist.map((step) => {
                const sectionId = step.docSection;
                const isActive = sectionId === activeSection;
                const allCompleted = step.subSteps.every(
                  (subStep) => subStep.completed,
                );
                const someCompleted = step.subSteps.some(
                  (subStep) => subStep.completed,
                );

                return (
                  <div
                    key={step.id}
                    style={{
                      marginBottom: "1.25rem",
                      padding: "0.75rem",
                      borderRadius: "var(--ifm-global-radius)",
                      backgroundColor: allCompleted
                        ? colors.successLight
                        : someCompleted
                          ? colors.warningLight
                          : colors.inactiveLight,
                      borderLeft: isActive
                        ? `3px solid ${colors.primary}`
                        : "none",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "0.75rem",
                        paddingBottom: "0.5rem",
                        borderBottom: `1px solid ${colors.border}`,
                        cursor: "pointer",
                      }}
                      onClick={() => scrollToSection(sectionId)}
                    >
                      <Heading
                        as="h4"
                        style={{
                          margin: 0,
                          fontSize: "1rem",
                          fontWeight: 600,
                          color: colors.text,
                        }}
                      >
                        {step.title}
                      </Heading>
                      <div>
                        {allCompleted ? (
                          <span
                            style={{
                              padding: "0.25rem 0.5rem",
                              borderRadius: "1rem",
                              backgroundColor: colors.successLight,
                              color: colors.success,
                              fontSize: "0.75rem",
                              fontWeight: 600,
                            }}
                          >
                            Completed
                          </span>
                        ) : someCompleted ? (
                          <span
                            style={{
                              padding: "0.25rem 0.5rem",
                              borderRadius: "1rem",
                              backgroundColor: colors.warningLight,
                              color: colors.warning,
                              fontSize: "0.75rem",
                              fontWeight: 600,
                            }}
                          >
                            In Progress
                          </span>
                        ) : (
                          <span
                            style={{
                              padding: "0.25rem 0.5rem",
                              borderRadius: "1rem",
                              backgroundColor: colors.inactiveLight,
                              color: colors.inactive,
                              fontSize: "0.75rem",
                              fontWeight: 600,
                            }}
                          >
                            Pending
                          </span>
                        )}
                      </div>
                    </div>

                    <ul
                      style={{
                        listStyle: "none",
                        padding: 0,
                        margin: 0,
                      }}
                    >
                      {step.subSteps.map((subStep) => (
                        <li
                          key={subStep.id}
                          style={{
                            marginBottom: "0.5rem",
                          }}
                        >
                          <label
                            style={{
                              display: "flex",
                              alignItems: "center",
                              padding: "0.5rem",
                              borderRadius: "var(--ifm-global-radius)",
                              cursor: "pointer",
                              color: colors.text,
                            }}
                          >
                            <input
                              type="checkbox"
                              checked={subStep.completed}
                              onChange={() => toggleStep(step.id, subStep.id)}
                              style={{
                                width: "18px",
                                height: "18px",
                                marginRight: "0.75rem",
                                accentColor: colors.primary,
                              }}
                            />
                            <span
                              style={{
                                textDecoration: subStep.completed
                                  ? "line-through"
                                  : "none",
                                opacity: subStep.completed ? 0.6 : 1,
                              }}
                            >
                              {subStep.text}
                            </span>
                          </label>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>

            <div
              style={{
                padding: "1rem",
                textAlign: "center",
                borderTop: `1px solid ${colors.border}`,
              }}
            >
              <button
                onClick={resetProgress}
                aria-label="Reset progress"
                style={{
                  background: "none",
                  border: `1px solid ${colors.primary}`,
                  color: colors.primary,
                  padding: "0.5rem 1.25rem",
                  borderRadius: "var(--ifm-global-radius)",
                  fontSize: "0.85rem",
                  fontWeight: 500,
                  cursor: "pointer",
                }}
              >
                Reset Progress
              </button>
            </div>
          </div>
        )}
      </div>

      {isSticky &&
        (isMiniView ? (
          renderMiniView()
        ) : (
          <div
            className="onboarding-floatingChecklist"
            style={{
              position: "fixed",
              top: "5.5rem",
              right: "1rem",
              width: "280px",
              zIndex: 999,
              borderRadius: "var(--ifm-global-radius)",
              boxShadow: "0 6px 16px rgba(0, 0, 0, 0.15)",
              backgroundColor: colors.cardBackground,
              border: `1px solid ${colors.border}`,
              overflow: "hidden",
            }}
          >
            <div
              className="onboarding-floatingHeader"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "0.75rem 1rem",
                backgroundColor: isDarkMode
                  ? colors.primaryDarker
                  : colors.primaryLightest,
                color: "white",
              }}
            >
              <div style={{ fontWeight: 600, fontSize: "0.95rem" }}>
                Onboarding Checklist
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                }}
              >
                <span
                  style={{
                    backgroundColor: colors.background,
                    borderRadius: "2rem",
                    padding: "0.1rem 0.5rem",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    color: colors.primary,
                  }}
                >
                  {completedCount}/{getTotalSteps()}
                </span>
                <button
                  onClick={toggleMiniView}
                  aria-label="Minimize checklist"
                  style={{
                    background: "none",
                    border: "none",
                    color: "white",
                    fontSize: "1rem",
                    cursor: "pointer",
                    width: "24px",
                    height: "24px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "50%",
                  }}
                >
                  ✕
                </button>
              </div>
            </div>

            <div style={{ padding: "0.5rem" }}>
              {stepStatuses.map((status) => (
                <div
                  key={status.id}
                  onClick={() => scrollToSection(status.docSection)}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "0.75rem 1rem",
                    borderRadius: "var(--ifm-global-radius)",
                    marginBottom: "0.5rem",
                    cursor: "pointer",
                    backgroundColor:
                      status.docSection === activeSection
                        ? `rgba(var(--ifm-color-primary-rgb), 0.08)`
                        : "transparent",
                    borderLeft:
                      status.docSection === activeSection
                        ? `3px solid ${colors.primary}`
                        : "none",
                    color: status.isComplete ? colors.success : colors.text,
                  }}
                >
                  <div style={{ fontSize: "0.9rem", fontWeight: 500 }}>
                    {status.title}
                  </div>
                  <div style={{ fontSize: "0.75rem", opacity: 0.8 }}>
                    {status.progress}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
    </>
  );
};

export default OnboardingChecklist;
